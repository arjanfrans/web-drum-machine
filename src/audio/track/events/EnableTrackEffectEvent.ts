export class EnableTrackEffectEvent {
    public static Name: string = "EnableTrackEffectEvent";

    constructor(public readonly effect: string, public readonly enable: boolean) {}
}
