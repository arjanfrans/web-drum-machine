import { Config } from "./Config";
import { Track } from "./Track";
import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { Transport } from "./Transport";
import { Bus } from "./Bus";
import { BusFactory } from "./BusFactory";

export class AudioEngine {
    public readonly tracks: Map<string, Track> = new Map<string, Track>();
    public readonly buses: Map<string, Bus> = new Map<string, Bus>();
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly transport: Transport;

    constructor(private readonly config: Config) {
        this.transport = new Transport(config);
    }

    public async init() {
        for (const trackData of this.config.trackData) {
            const track = new Track(trackData.id, trackData.name, trackData.sample, trackData.sequenceNotes);

            this.tracks.set(trackData.id, track);
        }

        this.buses.set("chorus", BusFactory.createChorusBus());
        this.buses.set("reverb", BusFactory.createReverbBus());

        await Tone.loaded();
        await Tone.start();

        this.transport.init();
    }
}
