export interface TrackData {
    id: string
    name: string
    sample: string
}

export interface SequencerPreset {
    id: string
    steps: number
    subdivision: number
    tracks: Array<{ id: string; data: boolean[] }>
}

export interface Config {
    sequencerPreset: SequencerPreset
    trackData: TrackData[]
}
