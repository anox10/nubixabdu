import { createClient } from "@supabase/supabase-js";

let rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Normalize URL in case user pasted REST endpoint with /rest/v1
if (rawUrl && rawUrl.includes("/rest/v1")) {
  rawUrl = rawUrl.split("/rest/v1")[0].replace(/\/+$/, "");
}

const isConfigured =
  rawUrl &&
  rawKey &&
  rawKey !== "YOUR_SUPABASE_ANON_PUBLIC_KEY" &&
  rawUrl !== "YOUR_SUPABASE_PROJECT_URL" &&
  rawUrl.startsWith("http");

if (!isConfigured) {
  console.warn(
    "⚠️ CLINORA NOTICE: Please enter your VITE_SUPABASE_ANON_KEY in frontend/.env"
  );
}

export const supabase = createClient(
  isConfigured ? rawUrl : (rawUrl || "https://placeholder.supabase.co"),
  isConfigured ? rawKey : "placeholder-anon-key"
);
