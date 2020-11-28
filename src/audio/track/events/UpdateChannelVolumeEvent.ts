export class UpdateChannelVolumeEvent {
    public static Name: string = "UpdateChannelVolumeEvent";

    constructor(public readonly volume: number) {}
}
