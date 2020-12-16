import { PatternTrack } from "./PatternTrack"
import { SequencerStep } from "./Sequencer"

export class Pattern {
    public readonly tracks: Map<string, PatternTrack> = new Map()

    constructor(steps: SequencerStep, tracks: string[]) {
        for (const track of tracks) {
            this.tracks.set(track, new PatternTrack(steps))
        }
    }

    public clear(): void {
        for (const patternTrack of this.tracks.values()) {
            patternTrack.clear()
        }
    }

    set steps(value: SequencerStep) {
        for (const pattern of this.tracks.values()) {
            pattern.steps = value
        }
    }

    public isCellActive(track: string, index: number): boolean {
        const patternTrack = this.tracks.get(track)

        if (!patternTrack) {
            throw new Error(`No PatterTrack for "${track} exists.`)
        }

        return patternTrack.getSequence()[index]
    }

    public setCell(track: string, index: number, value: boolean) {
        const patternTrack = this.tracks.get(track)

        if (!patternTrack) {
            throw new Error(`No PatterTrack for "${track} exists.`)
        }

        patternTrack.setCell(index, value)
    }
}
