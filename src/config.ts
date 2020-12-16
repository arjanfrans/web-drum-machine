import { Config } from "./audio/Config"

const SEQUENCER_PRESET_1 = {
    id: "preset_1",
    steps: 16,
    subdivision: 8,
    tracks: [
        {
            id: "kick",
            data: [
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
            ],
        },
        {
            id: "snare",
            data: [
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                false,
            ],
        },
        {
            id: "hh",
            data: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        },
        {
            id: "shaker",
            data: [
                false,
                false,
                true,
                true,
                false,
                false,
                true,
                true,
                false,
                false,
                true,
                true,
                false,
                false,
                true,
                true,
            ],
        },
    ],
}

export const CONFIG: Config = {
    sequencerPreset: SEQUENCER_PRESET_1,
    trackData: [
        {
            id: "kick",
            name: "Kick",
            sample: "assets/kick.wav",
        },
        {
            id: "snare",
            name: "Snare",
            sample: "assets/snare.wav",
        },
        {
            id: "hh",
            name: "HiHat",
            sample: "assets/hihat.wav",
        },
        {
            id: "stick1",
            name: "Stick",
            sample: "assets/stick1.wav",
        },
        {
            id: "perc1",
            name: "Perc.",
            sample: "assets/perc1.wav",
        },
        {
            id: "clap",
            name: "Clap",
            sample: "assets/clap.wav",
        },
        {
            id: "snap",
            name: "Snap",
            sample: "assets/snap.wav",
        },
        {
            id: "shaker",
            name: "Shaker",
            sample: "assets/shaker.wav",
        },
    ],
}
