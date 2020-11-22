import React from "react";
import {AudioEngine} from "../audio/AudioEngine";

interface StartViewProps {
    engine: AudioEngine
}

export const StartView = ({engine}: StartViewProps) => {
    return (
        <div>
            <button>Start</button>
        </div>
    );
};
