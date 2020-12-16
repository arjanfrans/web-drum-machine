import { SequencerStep } from "./Sequencer"
import { ArrayHelper } from "../../util/ArrayHelper"

export class PatternTrack {
    private data: boolean[] = []
    private _steps: SequencerStep

    constructor(steps: SequencerStep) {
        this._steps = steps

        this.clear()
    }

    public clear(): void {
        this.data = ArrayHelper.indexes(this._steps).map(() => false)
    }

    set steps(value: SequencerStep) {
        console.log()
        if (value > this._steps) {
            this.data = ArrayHelper.stretch(this.data, value)
        } else if (value < this._steps) {
            this.data = this.data.slice(0, value)
        }

        console.log(this.data.length)
        this._steps = value
    }

    public setCell(index: number, value: boolean) {
        this.data[index] = value
    }

    public getSequence(): boolean[] {
        return this.data
    }
}
