import { ApiError } from "../api/client";

// Pendo Track Events. The Pendo agent attaches the visitor and account to every
// event, so the properties only carry context about the action itself.
export type TrackProperties = Record<string, string | number | boolean>;

interface PendoAgent {
  track: (eventName: string, properties?: TrackProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

/** Sends a Pendo Track Event. Does nothing when the Pendo agent isn't loaded, and never throws. */
export function trackEvent(eventName: string, properties?: TrackProperties): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Tracking must never break the app.
  }
}

/** The HTTP status of a failed API call, or 0 when the request never got an answer. */
export function errorStatusCode(error: unknown): number {
  return error instanceof ApiError ? error.status : 0;
}

/** The number of days a trip covers, counting both the start and end dates. */
export function tripLengthDays(startDate: string, endDate: string): number {
  const days = (Date.parse(endDate) - Date.parse(startDate)) / 86_400_000 + 1;
  return Number.isFinite(days) ? Math.round(days) : 0;
}
