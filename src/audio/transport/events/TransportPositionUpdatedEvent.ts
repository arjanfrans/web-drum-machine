export class TransportPositionUpdatedEvent {
    public static Name: string = "TransportPositionUpdatedEvent"

    constructor(public readonly transportPosition: number) {}
}
