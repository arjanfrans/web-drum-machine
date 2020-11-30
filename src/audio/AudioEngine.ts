import { Config } from "./Config";
import { Track } from "./track/Track";
import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { Transport } from "./transport/Transport";
import { Bus } from "./bus/Bus";
import { BusFactory } from "./bus/BusFactory";
import { TrackFactory } from "./track/TrackFactory";

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
            this.tracks.set(
                trackData.id,
                TrackFactory.createTrack(trackData.id, trackData.name, trackData.sample, trackData.sequenceNotes)
            );
        }

        this.buses.set("chorus", BusFactory.createChorusBus());
        this.buses.set("reverb", BusFactory.createReverbBus());
        this.buses.set("delay", BusFactory.createDelayBus());

        await Tone.loaded();
        await Tone.start();

        this.transport.init();
    }
}
