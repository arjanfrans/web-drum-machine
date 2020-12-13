export class SetTrackNoteEvent {
    public static Name: string = "SetTrackNoteEvent"

    constructor(public readonly index: number, public readonly isActive: boolean) {}
}
