export class UpdateChannelPanningEvent {
    public static Name: string = "UpdateChannelPanningEvent"

    constructor(public readonly pan: number) {}
}
