import { Config } from "./Config";
import { SampleTrack } from "./SampleTrack";
import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { Transport } from "./Transport";

export class AudioEngine {
    public readonly tracks: Map<string, SampleTrack> = new Map<string, SampleTrack>();
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly transport: Transport;

    constructor(private readonly config: Config) {
        this.transport = new Transport(config);
    }

    public async init() {
        for (const trackData of this.config.trackData) {
            const track = new SampleTrack(trackData.id, trackData.name, trackData.sample, trackData.sequenceNotes);

            this.tracks.set(trackData.id, track);
        }
        await Tone.loaded();
        await Tone.start();

        this.transport.init();
    }
}
