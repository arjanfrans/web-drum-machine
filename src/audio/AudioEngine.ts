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
import { Sequencer, SequencerStep } from "./sequencer/Sequencer"
import { TransportStatusEnum } from "./transport/TransportStatusEnum"

export class AudioEngine {
    public readonly masterTrack = new MasterTrack()
    public readonly tracks: Map<string, Track> = new Map<string, Track>()
    public readonly buses: Map<string, Bus> = new Map<string, Bus>()
    public readonly transport: Transport
    public readonly sequencer: Sequencer
    private drawSequenceLoop?: Tone.Sequence
    private sequenceLoop?: Tone.Sequence

    constructor(private readonly config: Config) {
        this.transport = new Transport()

        const { sequencerPreset } = config

        this.sequencer = new Sequencer({
            steps: sequencerPreset.steps as SequencerStep,
            subdivision: sequencerPreset.subdivision,
            tracks: config.trackData.map((v) => v.id),
        })

        this.sequencer.loadPreset(sequencerPreset)
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

        await Tone.start()
        await Tone.loaded()

        this.transport.steps = this.sequencer.steps

        this.startSequenceLoop()

        this.startSequenceDrawLoop()
        this.startDrawLoop()

        this.sequencer.setOnChangeSteps((steps: number) => {
            let startAgain = false

            if (this.transport.transportStatus === TransportStatusEnum.Started) {
                this.transport.stop()
                startAgain = true
            }

            this.sequenceLoop?.dispose()
            this.drawSequenceLoop?.dispose()

            this.transport.steps = this.sequencer.steps

            this.startSequenceDrawLoop()
            this.startSequenceLoop()

            if (startAgain) {
                this.transport.start()
            }
        })
    }

    private createBuses(): void {
        this.buses.set("chorus", BusFactory.createChorusBus())
        this.buses.set("reverb", BusFactory.createReverbBus())
        this.buses.set("delay", BusFactory.createDelayBus())
    }

    private createTracks(): void {
        for (const trackData of this.config.trackData) {
            const track = TrackFactory.createTrack(trackData.id, trackData.name, trackData.sample, this.buses)

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
        this.drawSequenceLoop = new Tone.Sequence(
            (time, index) => {
                Tone.Draw.schedule(() => {
                    for (const sequenceDraw of this.getSequenceDraws()) {
                        sequenceDraw.sequenceDraw(time, index)
                    }
                }, time)
            },
            ArrayHelper.indexes(this.sequencer.steps),
            this.sequencer.subdivision
        ).start()
    }

    private startSequenceLoop(): void {
        console.log(this.sequencer.steps, this.sequencer.subdivision)
        this.sequenceLoop = new Tone.Sequence(
            (time, index) => {
                for (const sequenceUpdate of this.getSequenceUpdates()) {
                    if (sequenceUpdate.shouldUpdate(index, this.sequencer)) {
                        sequenceUpdate.sequenceUpdate(time, index)
                    }
                }
            },
            ArrayHelper.indexes(this.sequencer.steps),
            this.sequencer.subdivision
        ).start()
    }
}
