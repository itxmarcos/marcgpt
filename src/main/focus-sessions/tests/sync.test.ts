import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

// Mock config before importing modules that use it
vi.mock("../src/config.js", () => ({
  loadConfig: () => ({
    NOTION_API_KEY: "test-notion-key",
    NOTION_DATABASE_ID: "test-db-id",
    CLOCKIFY_API_KEY: "test-clockify-key",
    CLOCKIFY_WORKSPACE_ID: "test-workspace-id",
  }),
}));

// Mock Notion client
const mockQuerySyncReady = vi.fn();
const mockUpdateSyncStatus = vi.fn();
const mockExtractSessionTimes = vi.fn();
const mockExtractClockifyIds = vi.fn();
const mockMapSessionToDescription = vi.fn();

vi.mock("../src/notion.js", () => ({
  querySyncReady: (...args: unknown[]) => mockQuerySyncReady(...args),
  updateSyncStatus: (...args: unknown[]) => mockUpdateSyncStatus(...args),
  extractSessionTimes: (...args: unknown[]) => mockExtractSessionTimes(...args),
  extractClockifyIds: (...args: unknown[]) => mockExtractClockifyIds(...args),
  mapSessionToDescription: (...args: unknown[]) =>
    mockMapSessionToDescription(...args),
}));

// Mock Clockify client
const mockCreateTimeEntry = vi.fn();
const mockUpdateTimeEntry = vi.fn();

vi.mock("../src/clockify.js", () => ({
  createTimeEntry: (...args: unknown[]) => mockCreateTimeEntry(...args),
  updateTimeEntry: (...args: unknown[]) => mockUpdateTimeEntry(...args),
}));

// Import after mocks
const { syncPush } = await import("../src/sync.js");

// Import real (un-mocked) functions for unit testing data transformations
const {
  extractSessionTimes: realExtractSessionTimes,
  extractClockifyIds: realExtractClockifyIds,
  mapSessionToDescription: realMapSessionToDescription,
} = await vi.importActual<typeof import("../src/notion.js")>("../src/notion.js");

function makeFakePage(overrides: Record<string, unknown> = {}): PageObjectResponse {
  return {
    id: "page-1234-5678-abcd-ef0123456789",
    object: "page",
    properties: {},
    ...overrides,
  } as unknown as PageObjectResponse;
}

describe("syncPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when no sessions found", async () => {
    mockQuerySyncReady.mockResolvedValue([]);

    const results = await syncPush(false);

    expect(results).toEqual([]);
    expect(mockCreateTimeEntry).not.toHaveBeenCalled();
    expect(mockUpdateTimeEntry).not.toHaveBeenCalled();
  });

  it("creates a new time entry when clockify_time_entry_id is empty", async () => {
    const page = makeFakePage();
    mockQuerySyncReady.mockResolvedValue([page]);
    mockExtractSessionTimes.mockReturnValue({
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
    });
    mockExtractClockifyIds.mockReturnValue({
      projectId: "proj-123",
      taskId: null,
      timeEntryId: null,
    });
    mockMapSessionToDescription.mockReturnValue(
      "Deep Work | Objectives: Build sync | [Notion: page-1234]",
    );
    mockCreateTimeEntry.mockResolvedValue({ id: "new-entry-id" });
    mockUpdateSyncStatus.mockResolvedValue(undefined);

    const results = await syncPush(false);

    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("synced");
    expect(results[0].timeEntryId).toBe("new-entry-id");
    expect(mockCreateTimeEntry).toHaveBeenCalledWith("test-workspace-id", {
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
      projectId: "proj-123",
      taskId: undefined,
      description: "Deep Work | Objectives: Build sync | [Notion: page-1234]",
    });
    expect(mockUpdateTimeEntry).not.toHaveBeenCalled();
    expect(mockUpdateSyncStatus).toHaveBeenCalledWith(
      page.id,
      "Synced",
      "new-entry-id",
    );
  });

  it("updates existing time entry when clockify_time_entry_id is present (idempotency)", async () => {
    const page = makeFakePage();
    mockQuerySyncReady.mockResolvedValue([page]);
    mockExtractSessionTimes.mockReturnValue({
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
    });
    mockExtractClockifyIds.mockReturnValue({
      projectId: "proj-123",
      taskId: "task-456",
      timeEntryId: "existing-entry-id",
    });
    mockMapSessionToDescription.mockReturnValue("Session description");
    mockUpdateTimeEntry.mockResolvedValue({ id: "existing-entry-id" });
    mockUpdateSyncStatus.mockResolvedValue(undefined);

    const results = await syncPush(false);

    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("synced");
    expect(results[0].timeEntryId).toBe("existing-entry-id");
    expect(mockUpdateTimeEntry).toHaveBeenCalledWith(
      "test-workspace-id",
      "existing-entry-id",
      expect.objectContaining({ projectId: "proj-123", taskId: "task-456" }),
    );
    expect(mockCreateTimeEntry).not.toHaveBeenCalled();
  });

  it("sets sync_status to Error when Clockify rejects", async () => {
    const page = makeFakePage();
    mockQuerySyncReady.mockResolvedValue([page]);
    mockExtractSessionTimes.mockReturnValue({
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
    });
    mockExtractClockifyIds.mockReturnValue({
      projectId: "invalid-project",
      taskId: null,
      timeEntryId: null,
    });
    mockMapSessionToDescription.mockReturnValue("Session");
    mockCreateTimeEntry.mockRejectedValue(
      new Error('Clockify API error 400: {"message":"PROJECT_NOT_FOUND"}'),
    );
    mockUpdateSyncStatus.mockResolvedValue(undefined);

    const results = await syncPush(false);

    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("error");
    expect(results[0].error).toContain("PROJECT_NOT_FOUND");
    expect(mockUpdateSyncStatus).toHaveBeenCalledWith(
      page.id,
      "Error",
      undefined,
      expect.stringContaining("PROJECT_NOT_FOUND"),
    );
  });

  it("makes no API calls in dry-run mode", async () => {
    const page = makeFakePage();
    mockQuerySyncReady.mockResolvedValue([page]);
    mockExtractSessionTimes.mockReturnValue({
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
    });
    mockExtractClockifyIds.mockReturnValue({
      projectId: "proj-123",
      taskId: null,
      timeEntryId: null,
    });
    mockMapSessionToDescription.mockReturnValue("Session");

    const results = await syncPush(true);

    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("create");
    expect(results[0].entry).toBeDefined();
    expect(mockCreateTimeEntry).not.toHaveBeenCalled();
    expect(mockUpdateTimeEntry).not.toHaveBeenCalled();
    expect(mockUpdateSyncStatus).not.toHaveBeenCalled();
  });

  it("dry-run shows update action for sessions with existing time entry", async () => {
    const page = makeFakePage();
    mockQuerySyncReady.mockResolvedValue([page]);
    mockExtractSessionTimes.mockReturnValue({
      start: "2026-02-11T09:00:00.000Z",
      end: "2026-02-11T10:30:00.000Z",
    });
    mockExtractClockifyIds.mockReturnValue({
      projectId: "proj-123",
      taskId: null,
      timeEntryId: "existing-id",
    });
    mockMapSessionToDescription.mockReturnValue("Session");

    const results = await syncPush(true);

    expect(results[0].action).toBe("update");
  });
});

describe("mapSessionToDescription", () => {
  it("formats description with objectives and page ID", () => {
    const page = makeFakePage({
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Deep Work Session" }],
        },
        objectives: {
          type: "rich_text",
          rich_text: [{ plain_text: "Build the sync engine" }],
        },
        micro_objectives: {
          type: "rich_text",
          rich_text: [{ plain_text: "Write tests, implement CLI" }],
        },
      },
    });

    // Use the real (un-mocked) function for unit testing data transformation
    const desc = (realMapSessionToDescription as Function)(page);

    expect(desc).toContain("Deep Work Session");
    expect(desc).toContain("Build the sync engine");
    expect(desc).toContain("Write tests, implement CLI");
    expect(desc).toContain(`[Notion: ${page.id}]`);
  });
});

describe("extractSessionTimes", () => {
  it("extracts start and end times", () => {
    const page = makeFakePage({
      properties: {
        start_time: { type: "date", date: { start: "2026-02-11T09:00:00.000Z" } },
        end_time: { type: "date", date: { start: "2026-02-11T10:30:00.000Z" } },
      },
    });

    const times = (realExtractSessionTimes as Function)(page);

    expect(times.start).toBe("2026-02-11T09:00:00.000Z");
    expect(times.end).toBe("2026-02-11T10:30:00.000Z");
  });

  it("throws when start_time is missing", () => {
    const page = makeFakePage({
      properties: {
        start_time: { type: "date", date: null },
        end_time: { type: "date", date: { start: "2026-02-11T10:30:00.000Z" } },
      },
    });

    expect(() => (realExtractSessionTimes as Function)(page)).toThrow("missing start_time");
  });
});

describe("extractClockifyIds", () => {
  it("extracts project and time entry IDs", () => {
    const page = makeFakePage({
      properties: {
        clockify_project_id: {
          type: "rich_text",
          rich_text: [{ plain_text: "proj-abc" }],
        },
        clockify_task_id: {
          type: "rich_text",
          rich_text: [{ plain_text: "task-xyz" }],
        },
        clockify_time_entry_id: {
          type: "rich_text",
          rich_text: [{ plain_text: "entry-123" }],
        },
      },
    });

    const ids = (realExtractClockifyIds as Function)(page);

    expect(ids.projectId).toBe("proj-abc");
    expect(ids.taskId).toBe("task-xyz");
    expect(ids.timeEntryId).toBe("entry-123");
  });

  it("throws when clockify_project_id is missing", () => {
    const page = makeFakePage({
      properties: {
        clockify_project_id: { type: "rich_text", rich_text: [] },
      },
    });

    expect(() => (realExtractClockifyIds as Function)(page)).toThrow(
      "missing clockify_project_id",
    );
  });
});
