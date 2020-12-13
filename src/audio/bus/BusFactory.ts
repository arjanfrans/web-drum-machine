import * as Tone from "tone"
import { Bus } from "./Bus"

export class BusFactory {
    public static createReverbBus(): Bus {
        const bus = new Bus("reverb", "Reverb")

        const reverb = new Tone.Reverb({
            wet: 1,
            preDelay: 0.01,
        })

        bus.effectsRack.add("reverb", reverb)

        return bus
    }

    public static createChorusBus(): Bus {
        const bus = new Bus("chorus", "Chorus")

        const chorus = new Tone.Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0.5,
            wet: 1,
        })

        bus.effectsRack.add("chorus", chorus)

        return bus
    }

    public static createDelayBus(): Bus {
        const bus = new Bus("delay", "Delay")

        const delay = new Tone.FeedbackDelay("4n", 0.05)

        bus.effectsRack.add("delay", delay)

        return bus
    }
}
