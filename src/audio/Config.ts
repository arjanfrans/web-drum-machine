export interface TrackData {
    id: string
    name: string
    sample: string
    sequenceNotes: boolean[]
}

export interface Config {
    sequenceSteps: number
    noteSubdivision: string
    trackData: TrackData[]
}
