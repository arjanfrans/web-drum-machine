export class MuteChannelEvent {
    public static Name: string = "MuteChannelEvent"

    constructor(public readonly mute: boolean) {}
}
