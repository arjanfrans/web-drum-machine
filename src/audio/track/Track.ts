import * as Tone from "tone";
import { EffectsRack } from "../EffectsRack";
import { Decibels } from "tone/Tone/core/type/Units";
import { TrackEmitter } from "./TrackEmitter";

export class Track {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: TrackEmitter;
    public readonly channel: Tone.Channel;
    public readonly effectsRack: EffectsRack;
    public readonly sends: Map<string, Tone.Gain<"decibels">> = new Map<string, Tone.Gain<"decibels">>();

    constructor(
        public readonly id: string,
        public name: string,
        private sample: string,
        public readonly sequenceNotes: boolean[]
    ) {
        this.emitter = new TrackEmitter(this);
        this.player = new Tone.Player(sample);
        this.channel = new Tone.Channel(-6, 0);
        this.effectsRack = new EffectsRack(this.player, this.channel);

        this.player.connect(this.channel);
        this.channel.toDestination();

        this.updateSequence();
    }

    public send(bus: string, volume: Decibels = 0): void {
        const sendKnob = this.channel.send(bus, volume);

        this.sends.set(bus, sendKnob);
    }

    public getSend(bus: string): Tone.Gain<"decibels"> | null {
        return this.sends.get(bus) || null;
    }

    private updateSequence(): void {
        this.sequence = new Tone.Sequence(
            (time, index) => {
                if (this.sequenceNotes[index]) {
                    this.player.start(time, 0, "16t");
                }
            },
            Array.from(this.sequenceNotes.keys()),
            "8n"
        ).start();
    }
}
