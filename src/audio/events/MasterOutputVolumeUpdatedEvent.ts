export class MasterOutputVolumeUpdatedEvent {
    public static Name: string = "MasterOutputVolumeUpdatedEvent";

    constructor(public readonly leftVolume: number, public readonly rightVolume: number) {}
}
