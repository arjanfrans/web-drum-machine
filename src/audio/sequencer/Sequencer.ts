import { SequencerEmitter } from "./SequencerEmitter"
import { Pattern } from "./Pattern"
import { SequencerPreset } from "../Config"

export type SequencerStep = 4 | 8 | 16 | 32 | 64

type SequencerOptions = {
    steps: SequencerStep
    subdivision: number
    tracks: string[]
    onChangeSteps?: (steps: number) => void
}

export class Sequencer {
    public readonly emitter: SequencerEmitter = new SequencerEmitter(this)
    private patterns: Pattern[] = []
    private _steps: SequencerStep
    private onChangeSteps?: (steps: number) => void
    private _subdivision: string

    constructor(options: SequencerOptions) {
        this._steps = options.steps || 16
        this.onChangeSteps = options.onChangeSteps
        this.patterns.push(new Pattern(this._steps, options.tracks))
        this._subdivision = `${options.subdivision || 8}n`
    }

    public loadPreset(preset: SequencerPreset) {
        this.steps = preset.steps as SequencerStep
        this._subdivision = `${preset.subdivision}n`

        this.clear()
        const pattern = this.getCurrentPattern()

        for (const track of preset.tracks) {
            for (const [index, value] of track.data.entries()) {
                pattern.setCell(track.id, index, value)
            }
        }
    }

    public clear(): void {
        this.getCurrentPattern().clear()
    }

    get subdivision(): string {
        return this._subdivision
    }

    public setOnChangeSteps(onChangeSteps: (steps: number) => void): void {
        this.onChangeSteps = onChangeSteps
    }

    public getCurrentPattern(): Pattern {
        // TODO support multiple patterns
        return this.patterns[0]
    }

    public getPattern(index: number): Pattern {
        const pattern = this.patterns[index]

        if (!pattern) {
            throw new Error(`Pattern with index "${index}" not found.`)
        }

        return pattern
    }

    get steps(): SequencerStep {
        return this._steps
    }

    set steps(value: SequencerStep) {
        this._steps = value

        for (const pattern of this.patterns) {
            pattern.steps = value
        }

        if (this.onChangeSteps) {
            this.onChangeSteps(value)
        }
    }

    public setCell(patternIndex: number, track: string, cellIndex: number, value: boolean) {
        const pattern = this.getPattern(patternIndex)

        pattern.setCell(track, cellIndex, value)
    }
}
