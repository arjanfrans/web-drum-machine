import { Track } from "../Track"

export class TrackEvent {
    public static Name: string = "TrackEvent"

    constructor(public readonly track: Track) {}
}
