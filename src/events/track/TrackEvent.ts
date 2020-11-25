import { SampleTrack } from "../../audio/SampleTrack";

export class TrackEvent {
    public static Name: string = "TrackEvent";

    constructor(public readonly track: SampleTrack) {}
}
