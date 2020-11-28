export class SetChannelChorusEvent {
    public static Name: string = "SetChannelChorusEvent";

    constructor(public readonly enable: boolean) {}
}
