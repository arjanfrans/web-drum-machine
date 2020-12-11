import React from "react";
import {Track} from "../../../../audio/track/Track";
import {SendControl} from "../sends/SendControl";

interface SendsTabsProps {
    track: Track
}

export class SendsTab extends React.Component<SendsTabsProps, {}> {
    public render() {
        const sendElements = [];

        for (const [sendName, sendValue] of this.props.track.sends.entries()) {
            sendElements.push(
                <SendControl key={sendName} name={sendName} track={this.props.track} send={sendValue}/>
            )
        }

        return (
            <div>
                {sendElements}
            </div>
        );
    }
}
