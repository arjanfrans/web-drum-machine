export enum TransportStatusEnum {
    Started = "started",
    Stopped = "stopped",
    Paused = "paused",
}
export interface AudioState {
    transportPosition: number;
    transportStatus: TransportStatusEnum;
}
