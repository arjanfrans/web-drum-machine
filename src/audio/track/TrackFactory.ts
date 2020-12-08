import { Track } from "./Track";
import * as Tone from "tone";

export class TrackFactory {
    public static createTrack(id: string, name: string, sample: string, sequenceNotes: boolean[]): Track {
        const track = new Track(id, name, sample, sequenceNotes);

        const autoWah = new Tone.AutoWah(50, 6, -30);

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
        const bitCrusher = new Tone.BitCrusher({
            bits: 4,
        });

        const distortion = new Tone.Distortion({
            distortion: 0.8,
        });

        track.effectsRack.add("autoWah", autoWah);
        track.effectsRack.add("distortion", distortion);
        track.effectsRack.add("bitCrusher", bitCrusher);
        track.effectsRack.add("chorus", chorus);
        track.effectsRack.add("reverb", reverb, "chorus");
        track.effectsRack.disableEffect("autoWah");
        track.effectsRack.disableEffect("distortion");
        track.effectsRack.disableEffect("bitCrusher");
        track.effectsRack.disableEffect("chorus");
        track.effectsRack.disableEffect("reverb");

        return track;
    }
}
