export interface DevicePatch {
    activationSeconds?: number,
    irrigateSeconds?: number,
    state?: "CLOSED" | "IRRIGATING" | "ERROR",
    error?: string,
    lastReceivedUpdate?: string,
}