import { config } from "dotenv";

// Load variables from `.env` into process.env at import time.
// If `.env` is missing, `config()` is effectively a no-op and only
// existing environment variables (e.g., from the OS or container) are used.
config();

/**
 * Global configuration object.
 */
export const Environment = {};
