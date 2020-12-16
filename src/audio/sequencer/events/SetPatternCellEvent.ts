export class SetPatternCellEvent {
    public static Name: string = "SetPatternCellEvent"

    constructor(
        public readonly patternIndex: number,
        public readonly track: string,
        public readonly cell: number,
        public readonly value: boolean
    ) {}
}
