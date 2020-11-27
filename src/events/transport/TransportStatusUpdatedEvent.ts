import { TransportStatusEnum } from "../../audio/Transport";

export class TransportStatusUpdatedEvent {
    public static Name: string = "TransportStatusUpdatedEvent";

    constructor(public readonly status: TransportStatusEnum) {}
}
