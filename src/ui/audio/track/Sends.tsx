import React from "react";
import {Track} from "../../../audio/track/Track";
import {UpdateSendVolumeEvent} from "../../../audio/track/events/UpdateSendVolumeEvent";
import {VolumeSlider} from "../../component/VolumeSlider";
import styles from "./Sends.module.css"

interface SendValue {
    volume?: number
}

interface SendsProps {
    track: Track
}

interface SendsState {
    sends: Map<string, SendValue>
}


export class Sends extends React.Component<SendsProps, SendsState> {
    constructor(props: SendsProps) {
        super(props);

        const sends = new Map<string, SendValue>();

        for (const [key, value] of props.track.sends.entries()) {
            sends.set(key, {volume: value ? value.gain.value : undefined})
        }

        this.state = {
            sends
        }
    }

    private updateSend(busName: string, value: number)
    {
        const sends = new Map<string, SendValue>(Array.from(this.state.sends.entries()));

        sends.set(busName, {volume: value});

        this.props.track.emitter.emit(new UpdateSendVolumeEvent(busName, value));

        this.setState({
            sends
        });
    }

    public render() {
        const sendElements = [];

        for (const [sendName, sendValue] of this.state.sends.entries()) {
            sendElements.push(
                <div key={sendName} title={`Send: ${sendName}`}>
                    <VolumeSlider
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const volume = Number.parseInt(event.currentTarget.value);

                            this.updateSend(sendName, volume)
                        }}
                        defaultValue={`${sendValue.volume}`}
                    />
                </div>
            )
        }

        return (
            <div className={styles.container}>
                {sendElements}
            </div>
        );
    }
}
