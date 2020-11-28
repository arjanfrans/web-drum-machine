export class UpdateSendVolumeEvent {
    public static Name: string = "UpdateSendVolumeEvent";

    constructor(public readonly bus: string, public readonly volume: number) {}
}
