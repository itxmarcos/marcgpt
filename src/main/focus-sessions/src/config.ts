import { z } from "zod";

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  NOTION_DATABASE_ID: z.string().min(1, "NOTION_DATABASE_ID is required"),
  CLOCKIFY_API_KEY: z.string().min(1, "CLOCKIFY_API_KEY is required"),
  CLOCKIFY_WORKSPACE_ID: z.string().min(1, "CLOCKIFY_WORKSPACE_ID is required"),
});

export type Config = z.infer<typeof envSchema>;

let _config: Config | null = null;

export function loadConfig(): Config {
  if (_config) return _config;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Missing environment variables: ${missing}`);
  }

  _config = result.data;
  return _config;
}
