import { Track } from "./Track";
import * as Tone from "tone";

export class TrackFactory {
    public static createTrack(id: string, name: string, sample: string, sequenceNotes: boolean[]): Track {
        const track = new Track(id, name, sample, sequenceNotes);

        const reverb = new Tone.Reverb({
            wet: 0.5,
            preDelay: 0.01,
        });
        const chorus = new Tone.Chorus({
            depth: 0.4,
            spread: 0.4,
            feedback: 0.4,
            wet: 0.7,
        });

        track.effectsRack.add("chorus", chorus);
        track.effectsRack.add("reverb", reverb, "chorus");
        track.effectsRack.disableEffect("chorus");
        track.effectsRack.disableEffect("reverb");

        return track;
    }
}
