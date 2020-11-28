import { TransportStatusEnum } from "../TransportStatusEnum";

export class TransportStatusUpdatedEvent {
    public static Name: string = "TransportStatusUpdatedEvent";

    constructor(public readonly status: TransportStatusEnum) {}
}
