import * as Tone from "tone";
import { Bus } from "./Bus";

export class BusFactory {
    public static createReverbBus(): Bus {
        const bus = new Bus("reverb", "Reverb");

        const reverb = new Tone.Reverb({
            wet: 1,
            preDelay: 0.01,
        });

        bus.effectsRack.add("reverb", reverb);

        return bus;
    }

    public static createChorusBus(): Bus {
        const bus = new Bus("chorus", "Chorus");

        const chorus = new Tone.Chorus({
            depth: 0.4,
            spread: 0.4,
            feedback: 0.4,
            wet: 1,
        });

        bus.effectsRack.add("chorus", chorus);

        return bus;
    }
}
