export interface Device {
    _id?: string,
    activationSeconds: number,
    irrigateSeconds: number,
    state: "CLOSED" | "IRRIGATING" | "ERROR",
    error?: string,
    lastReceivedUpdate?: string,
}