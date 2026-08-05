import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** MSW browser worker — intercepts fetch when mock mode is enabled. */
export const worker = setupWorker(...handlers);
