import { Sequencer } from "./sequencer/Sequencer"

export interface SequenceLoopInterface {
    sequenceUpdate(time: number, index: number): void

    shouldUpdate(index: number, sequencer: Sequencer): boolean
}
