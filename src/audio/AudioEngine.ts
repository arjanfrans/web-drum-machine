import { Config } from "./Config";
import { Track } from "./track/Track";
import * as Tone from "tone";
import { Transport } from "./transport/Transport";
import { Bus } from "./bus/Bus";
import { BusFactory } from "./bus/BusFactory";
import { TrackFactory } from "./track/TrackFactory";
import { MasterTrack } from "./track/MasterTrack";

export class AudioEngine {
    public readonly masterTrack = new MasterTrack();
    public readonly tracks: Map<string, Track> = new Map<string, Track>();
    public readonly buses: Map<string, Bus> = new Map<string, Bus>();
    public readonly transport: Transport;

    constructor(private readonly config: Config) {
        this.transport = new Transport(config);
    }

    public async init() {
        this.buses.set("chorus", BusFactory.createChorusBus());
        this.buses.set("reverb", BusFactory.createReverbBus());
        this.buses.set("delay", BusFactory.createDelayBus());

        for (const trackData of this.config.trackData) {
            const track = TrackFactory.createTrack(
                trackData.id,
                trackData.name,
                trackData.sample,
                trackData.sequenceNotes,
                this.buses
            );

            this.tracks.set(trackData.id, track);
        }

        await Tone.loaded();
        await Tone.start();

        new Tone.Loop((time) => {
            Tone.Draw.schedule(() => {
                this.masterTrack.draw();

                for (const track of this.tracks.values()) {
                    track.draw();
                }

                for (const bus of this.buses.values()) {
                    bus.draw();
                }
            }, time);
        }, 0.1).start(0);

        await this.transport.init();
    }
}
