import { Config } from "./Config"
import { Track } from "./track/Track"
import * as Tone from "tone"
import { Transport } from "./transport/Transport"
import { Bus } from "./bus/Bus"
import { BusFactory } from "./bus/BusFactory"
import { TrackFactory } from "./track/TrackFactory"
import { MasterTrack } from "./track/MasterTrack"
import { Settings } from "./Settings"
import { DrawLoopInterface } from "./DrawLoopInterface"
import { ArrayHelper } from "../util/ArrayHelper"
import { SequenceLoopInterface } from "./SequenceLoopInterface"
import { SequenceDrawLoopInterface } from "./SequenceDrawLoopInterface"

export class AudioEngine {
    public readonly masterTrack = new MasterTrack()
    public readonly tracks: Map<string, Track> = new Map<string, Track>()
    public readonly buses: Map<string, Bus> = new Map<string, Bus>()
    public readonly transport: Transport
    private outputBuffer?: Tone.ToneAudioBuffer

    constructor(private readonly config: Config) {
        this.transport = new Transport(config)
    }

    private getDraws(): Array<DrawLoopInterface> {
        return [this.masterTrack, ...this.tracks.values(), ...this.buses.values()]
    }

    private getSequenceUpdates(): Array<SequenceLoopInterface> {
        return [this.transport, ...this.tracks.values()]
    }

    private getSequenceDraws(): Array<SequenceDrawLoopInterface> {
        return [this.transport]
    }

    public async init() {
        this.createBuses()
        this.createTracks()

        await Tone.loaded()
        await Tone.start()

        this.outputBuffer = await Tone.Offline(() => {
            this.startSequenceLoop()
        }, Settings.offlineBufferLength)

        this.startSequenceDrawLoop()
        this.startDrawLoop()
    }

    private createBuses(): void {
        this.buses.set("chorus", BusFactory.createChorusBus())
        this.buses.set("reverb", BusFactory.createReverbBus())
        this.buses.set("delay", BusFactory.createDelayBus())
    }

    private createTracks(): void {
        for (const trackData of this.config.trackData) {
            const track = TrackFactory.createTrack(
                trackData.id,
                trackData.name,
                trackData.sample,
                trackData.sequenceNotes,
                this.buses
            )

            this.tracks.set(trackData.id, track)
        }
    }

    private startDrawLoop(): void {
        new Tone.Loop((time) => {
            Tone.Draw.schedule(() => {
                for (const drawable of this.getDraws()) {
                    drawable.draw(time)
                }
            }, time)
        }, Settings.drawInterval).start()
    }

    private startSequenceDrawLoop(): void {
        new Tone.Sequence(
            (time, index) => {
                Tone.Draw.schedule(() => {
                    for (const sequenceDraw of this.getSequenceDraws()) {
                        sequenceDraw.sequenceDraw(time, index)
                    }
                }, time)
            },
            ArrayHelper.indexes(this.config.sequenceSteps),
            this.config.noteSubdivision
        ).start()
    }

    private startSequenceLoop(): void {
        new Tone.Sequence(
            (time, index) => {
                for (const sequenceUpdate of this.getSequenceUpdates()) {
                    sequenceUpdate.sequenceUpdate(time, index)
                }
            },
            ArrayHelper.indexes(this.config.sequenceSteps),
            this.config.noteSubdivision
        ).start()
    }
}
