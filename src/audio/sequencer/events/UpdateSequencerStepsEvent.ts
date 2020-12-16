export class UpdateSequencerStepsEvent {
    public static Name: string = "UpdateSequencerStepsEvent"

    constructor(public readonly steps: number) {}
}
