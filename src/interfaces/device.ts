export interface Device {
    _id?: string,
    activationSeconds: number,
    irrigateSeconds: number,
    name: string,
    lastReceivedUpdate?: string,
}