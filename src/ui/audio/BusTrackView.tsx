import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";

interface BusTrackViewProps {
    bus: Bus
}

interface BusTrackViewState {
    volume: number
}

export class BusTrackView extends React.Component<BusTrackViewProps, BusTrackViewState> {
    constructor(props: BusTrackViewProps) {
        super(props);

        this.state = {
            volume: props.bus.channel.volume.value
        }
    }

    public render() {
        const {bus} = this.props;

        const updateVolume = (event: React.FormEvent<HTMLInputElement>) => {
            const volume = Number.parseInt(event.currentTarget.value);

            if (volume !== bus.channel.volume.value) {
                bus.emitter.emit(new UpdateChannelVolumeEvent(volume));
                this.setState({
                    volume
                })
            }
        }

        return (
            <>
                <td>
                   <span title="Volume">
                        <input className="vertical-range" onChange={updateVolume} type="range" step="1"
                               min="-32"
                               max="12"
                               value={this.state.volume}/>
                    </span>
                    <div>
                        {bus.name}
                    </div>
                </td>
            </>
        );
    }
}
