import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import { loadConfig } from "./config.js";

let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;
  const config = loadConfig();
  _client = new Client({ auth: config.NOTION_API_KEY });
  return _client;
}

export type SyncStatus = "Draft" | "Ready" | "Synced" | "Error";

export interface SessionTimes {
  start: string;
  end: string;
}

export interface ClockifyIds {
  projectId: string;
  taskId: string | null;
  timeEntryId: string | null;
}

// Helper to extract plain text from a rich_text property
function getRichText(
  page: PageObjectResponse,
  property: string,
): string {
  const prop = page.properties[property];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((rt) => rt.plain_text).join("");
  }
  return "";
}

// Helper to extract checkbox value
function getCheckbox(
  page: PageObjectResponse,
  property: string,
): boolean {
  const prop = page.properties[property];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

// Helper to extract title text
function getTitle(page: PageObjectResponse): string {
  const prop = page.properties["Name"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  return "";
}

export async function querySyncReady(): Promise<PageObjectResponse[]> {
  const config = loadConfig();
  const client = getClient();

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response: QueryDatabaseResponse = await client.databases.query({
      database_id: config.NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "sync_status",
            select: { equals: "Ready" },
          },
          {
            property: "achieved",
            checkbox: { equals: true },
          },
        ],
      },
      start_cursor: cursor,
    });

    for (const page of response.results) {
      if ("properties" in page) {
        pages.push(page as PageObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

export function extractSessionTimes(page: PageObjectResponse): SessionTimes {
  const startProp = page.properties["start_time"];
  const endProp = page.properties["end_time"];

  if (startProp?.type !== "date" || !startProp.date?.start) {
    throw new Error(`Page ${page.id}: missing start_time`);
  }
  if (endProp?.type !== "date" || !endProp.date?.start) {
    throw new Error(`Page ${page.id}: missing end_time`);
  }

  return {
    start: startProp.date.start,
    end: endProp.date.start,
  };
}

export function extractClockifyIds(page: PageObjectResponse): ClockifyIds {
  const projectId = getRichText(page, "clockify_project_id");
  if (!projectId) {
    throw new Error(`Page ${page.id}: missing clockify_project_id`);
  }

  return {
    projectId,
    taskId: getRichText(page, "clockify_task_id") || null,
    timeEntryId: getRichText(page, "clockify_time_entry_id") || null,
  };
}

export function mapSessionToDescription(page: PageObjectResponse): string {
  const title = getTitle(page);
  const objectives = getRichText(page, "objectives");
  const microObjectives = getRichText(page, "micro_objectives");

  const parts: string[] = [];
  if (title) parts.push(title);
  if (objectives) parts.push(`Objectives: ${objectives}`);
  if (microObjectives) parts.push(`Micro-objectives: ${microObjectives}`);
  parts.push(`[Notion: ${page.id}]`);

  return parts.join(" | ");
}

export async function updateSyncStatus(
  pageId: string,
  status: SyncStatus,
  timeEntryId?: string,
  error?: string,
): Promise<void> {
  const client = getClient();

  const properties: Record<string, unknown> = {
    sync_status: {
      select: { name: status },
    },
    last_synced_at: {
      date: { start: new Date().toISOString() },
    },
  };

  if (timeEntryId !== undefined) {
    properties.clockify_time_entry_id = {
      rich_text: [{ text: { content: timeEntryId } }],
    };
  }

  if (status === "Error" && error) {
    properties.sync_error = {
      rich_text: [{ text: { content: error.slice(0, 2000) } }],
    };
  }

  if (status === "Synced") {
    properties.sync_error = {
      rich_text: [],
    };
  }

  await client.pages.update({
    page_id: pageId,
    properties,
  });
}

export { getCheckbox, getRichText, getTitle };
