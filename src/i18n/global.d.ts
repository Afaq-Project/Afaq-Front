import type messages from "../messages/en.json";
import type { Locale } from "./config";

// Type-checks message keys against en.json; ar.json must mirror it.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
