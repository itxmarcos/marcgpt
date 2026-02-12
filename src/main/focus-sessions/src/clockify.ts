import { loadConfig } from "./config.js";

const BASE_URL = "https://api.clockify.me/api/v1";

export interface TimeEntryPayload {
  start: string;
  end: string;
  projectId: string;
  taskId?: string;
  description: string;
  billable?: boolean;
}

export interface TimeEntry {
  id: string;
  description: string;
  projectId: string;
  taskId: string | null;
  timeInterval: {
    start: string;
    end: string;
    duration: string;
  };
}

async function clockifyFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = loadConfig();
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": config.CLOCKIFY_API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Clockify API error ${response.status}: ${body}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function createTimeEntry(
  workspaceId: string,
  entry: TimeEntryPayload,
): Promise<TimeEntry> {
  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/time-entries`,
    {
      method: "POST",
      body: JSON.stringify(entry),
    },
  );
}

export async function updateTimeEntry(
  workspaceId: string,
  timeEntryId: string,
  entry: TimeEntryPayload,
): Promise<TimeEntry> {
  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
    {
      method: "PUT",
      body: JSON.stringify(entry),
    },
  );
}

export async function getTimeEntries(
  workspaceId: string,
  userId: string,
  start?: string,
  end?: string,
): Promise<TimeEntry[]> {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  const query = params.toString() ? `?${params.toString()}` : "";

  return clockifyFetch<TimeEntry[]>(
    `/workspaces/${workspaceId}/user/${userId}/time-entries${query}`,
  );
}
