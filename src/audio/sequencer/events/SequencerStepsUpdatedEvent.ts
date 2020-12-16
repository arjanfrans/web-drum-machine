export class SequencerStepsUpdatedEvent {
    public static Name: string = "SequencerStepsUpdatedEvent"

    constructor(public readonly steps: number) {}
}
