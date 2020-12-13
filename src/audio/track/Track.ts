import * as Tone from "tone";
import { EffectsRack } from "../EffectsRack";
import { TrackEmitter } from "./TrackEmitter";
import { Bus } from "../bus/Bus";
import { Send } from "./Send";
import { TrackOutputVolumeUpdatedEvent } from "./events/TrackOutputVolumeUpdatedEvent";

export class Track {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: TrackEmitter;
    public readonly channel: Tone.Channel;
    public readonly meter: Tone.Meter;
    public readonly effectsRack: EffectsRack;
    public readonly sends: Map<string, Send> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
        private sample: string,
        public readonly sequenceNotes: boolean[],
        private readonly buses: Map<string, Bus>
    ) {
        this.emitter = new TrackEmitter(this);
        this.player = new Tone.Player(sample);
        this.channel = new Tone.Channel(-6, 0);
        this.effectsRack = new EffectsRack(this.player, this.channel);
        this.meter = new Tone.Meter({ channels: 2, smoothing: 0.3 });

        this.player.connect(this.channel);
        this.channel.toDestination();
        this.channel.connect(this.meter);

        this.updateSequence();
    }

    set mute(value: boolean) {
        this.channel.mute = value;
    }

    set solo(value: boolean) {
        this.channel.solo = value;

        for (const send of this.sends.values()) {
            send.channel.solo = value;
        }
    }

    public addSend(busName: string): Send {
        const bus = this.buses.get(busName);

        if (!bus) {
            throw new Error(`Bus ${busName} not found.`);
        }

        const send = new Send(this.channel, bus);

        this.sends.set(busName, send);

        return send;
    }

    public getSend(busName: string): Send {
        const send = this.sends.get(busName);

        if (!send) {
            throw new Error(`Send ${busName} is not added to this track.`);
        }

        return send;
    }

    private updateSequence(): void {
        this.sequence = new Tone.Sequence(
            (time, index) => {
                if (this.sequenceNotes[index]) {
                    this.player.start(time, 0);
                }
            },
            Array.from(this.sequenceNotes.keys()),
            "8n"
        ).start();
    }

    public draw(): void {
        const value = this.meter.getValue();

        if (Array.isArray(value)) {
            this.emitter.emit(new TrackOutputVolumeUpdatedEvent(value[0], value[1]));
        } else {
            this.emitter.emit(new TrackOutputVolumeUpdatedEvent(value, value));
        }
    }
}
