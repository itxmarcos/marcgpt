#!/usr/bin/env node

import { Command } from "commander";
import { syncPush, type SyncResult } from "./sync.js";

const program = new Command();

program
  .name("focus-sessions")
  .description("Focus Sessions sync engine: Notion <-> Clockify")
  .version("1.0.0");

program
  .command("sync:push")
  .description("Push Ready+Achieved sessions from Notion to Clockify")
  .action(async () => {
    try {
      const results = await syncPush(false);
      printResults(results, false);
    } catch (err) {
      console.error("Fatal error:", err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("sync:dry-run")
  .description("Preview what would be synced (no changes)")
  .action(async () => {
    try {
      const results = await syncPush(true);
      printResults(results, true);
    } catch (err) {
      console.error("Fatal error:", err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("sync:pull")
  .description("Pull time entries from Clockify to Notion (not implemented)")
  .action(() => {
    console.log("sync:pull is not yet implemented.");
    process.exit(0);
  });

function printResults(results: SyncResult[], dryRun: boolean): void {
  const prefix = dryRun ? "[DRY RUN] " : "";

  if (results.length === 0) {
    console.log(`${prefix}No sessions to sync.`);
    return;
  }

  console.log(`${prefix}${results.length} session(s) processed:\n`);

  for (const r of results) {
    const pageShort = r.pageId.slice(0, 8);

    switch (r.action) {
      case "create":
        console.log(
          `  [CREATE] ${pageShort}... -> ${r.entry?.projectId ?? "?"} (${r.entry?.start} - ${r.entry?.end})`,
        );
        break;
      case "update":
        console.log(
          `  [UPDATE] ${pageShort}... -> ${r.entry?.projectId ?? "?"} (${r.entry?.start} - ${r.entry?.end})`,
        );
        break;
      case "synced":
        console.log(
          `  [SYNCED] ${pageShort}... -> time entry ${r.timeEntryId}`,
        );
        break;
      case "error":
        console.log(`  [ERROR]  ${pageShort}... -> ${r.error}`);
        break;
    }
  }

  const errors = results.filter((r) => r.action === "error");
  if (errors.length > 0) {
    console.log(`\n${errors.length} error(s) encountered.`);
    process.exit(1);
  }
}

program.parse();
