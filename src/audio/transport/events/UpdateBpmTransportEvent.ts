export class UpdateBpmTransportEvent {
    public static Name: string = "UpdateBpmTransportEvent";

    constructor(public readonly bpm: number) {}
}
