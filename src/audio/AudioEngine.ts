import { Config } from "./Config";
import { Track } from "./track/Track";
import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { Transport } from "./transport/Transport";
import { Bus } from "./bus/Bus";
import { BusFactory } from "./bus/BusFactory";
import { TrackFactory } from "./track/TrackFactory";
import { MasterOutputVolumeUpdatedEvent } from "./events/MasterOutputVolumeUpdatedEvent";

export class AudioEngine {
    public readonly tracks: Map<string, Track> = new Map<string, Track>();
    public readonly buses: Map<string, Bus> = new Map<string, Bus>();
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly transport: Transport;
    public readonly outputMeter: Tone.Meter = new Tone.Meter({ channels: 2, smoothing: 0.5, normalRange: true });

    constructor(private readonly config: Config) {
        this.transport = new Transport(config);
    }

    public async init() {
        const masterChannel = Tone.getDestination();

        this.buses.set("chorus", BusFactory.createChorusBus());
        this.buses.set("reverb", BusFactory.createReverbBus());
        this.buses.set("delay", BusFactory.createDelayBus());

        for (const trackData of this.config.trackData) {
            const track = TrackFactory.createTrack(
                trackData.id,
                trackData.name,
                trackData.sample,
                trackData.sequenceNotes
            );

            track.send("chorus");
            track.send("reverb");
            track.send("delay");

            this.tracks.set(trackData.id, track);
        }

        await Tone.loaded();
        await Tone.start();

        masterChannel.connect(this.outputMeter);

        new Tone.Loop((time) => {
            Tone.Draw.schedule(() => {
                const value = this.outputMeter.getValue();

                if (Array.isArray(value)) {
                    this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value[0], value[1]));
                } else {
                    this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value, value));
                }
            }, time);
        }, 0.1).start(0);

        this.transport.init();
    }
}
