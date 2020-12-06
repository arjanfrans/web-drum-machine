export class TrackOutputVolumeUpdatedEvent {
    public static Name: string = "TrackOutputVolumeUpdatedEvent";

    constructor(public readonly leftVolume: number, public readonly rightVolume: number) {}
}
