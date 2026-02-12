import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { loadConfig } from "./config.js";
import {
  createTimeEntry,
  updateTimeEntry,
  type TimeEntryPayload,
} from "./clockify.js";
import {
  querySyncReady,
  extractSessionTimes,
  extractClockifyIds,
  mapSessionToDescription,
  updateSyncStatus,
} from "./notion.js";

export interface SyncResult {
  pageId: string;
  action: "create" | "update" | "synced" | "error";
  timeEntryId?: string;
  entry?: TimeEntryPayload;
  error?: string;
}

export async function syncPush(dryRun = false): Promise<SyncResult[]> {
  const config = loadConfig();
  const sessions = await querySyncReady();

  if (sessions.length === 0) {
    return [];
  }

  const results: SyncResult[] = [];

  for (const session of sessions) {
    const result = await syncSession(session, config.CLOCKIFY_WORKSPACE_ID, dryRun);
    results.push(result);
  }

  return results;
}

async function syncSession(
  session: PageObjectResponse,
  workspaceId: string,
  dryRun: boolean,
): Promise<SyncResult> {
  try {
    const times = extractSessionTimes(session);
    const ids = extractClockifyIds(session);
    const description = mapSessionToDescription(session);

    const entry: TimeEntryPayload = {
      start: times.start,
      end: times.end,
      projectId: ids.projectId,
      taskId: ids.taskId ?? undefined,
      description,
    };

    const isUpdate = !!ids.timeEntryId;

    if (dryRun) {
      return {
        pageId: session.id,
        action: isUpdate ? "update" : "create",
        entry,
      };
    }

    let timeEntryId: string;
    if (isUpdate) {
      await updateTimeEntry(workspaceId, ids.timeEntryId!, entry);
      timeEntryId = ids.timeEntryId!;
    } else {
      const created = await createTimeEntry(workspaceId, entry);
      timeEntryId = created.id;
    }

    await updateSyncStatus(session.id, "Synced", timeEntryId);

    return {
      pageId: session.id,
      action: "synced",
      timeEntryId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (!dryRun) {
      try {
        await updateSyncStatus(session.id, "Error", undefined, message);
      } catch {
        // Best effort — don't mask original error
      }
    }

    return {
      pageId: session.id,
      action: "error",
      error: message,
    };
  }
}
