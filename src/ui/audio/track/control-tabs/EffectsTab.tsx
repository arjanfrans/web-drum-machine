import React from "react";
import {Track} from "../../../../audio/track/Track";
import {ToggleButton} from "../../../component/ToggleButton";
import {EnableTrackEffectEvent} from "../../../../audio/track/events/EnableTrackEffectEvent";

type EffectsTabProps = {
    track: Track
}

type EffectsTabState = {
    effects: { [key: string]: boolean}
}

export class EffectsTab extends React.Component<EffectsTabProps, EffectsTabState> {
    constructor(props: EffectsTabProps) {
        super(props);

        const effects: { [key: string]: boolean } = {};

        for (const connection of props.track.effectsRack.effects.values()) {
            effects[connection.name] = connection.enabled
        }

        this.state = {
            effects
        }
    }

    private enableEffect(effect: string, enabled: boolean) {
        this.props.track.emitter.emit(new EnableTrackEffectEvent(effect, enabled))

        this.setState({
            effects: {
                ...this.state.effects,
                [effect]: enabled
            }
        })
    }

    public render() {
        const effectElements = [];

        for (const [effect, enabled] of Object.entries(this.state.effects)) {

            effectElements.push(
                <div key={effect}>
                    <ToggleButton
                        onClick={() => this.enableEffect(effect, !enabled)}
                        isActive={!enabled}
                        label={effect}
                        activeColor={'white'}
                        title={effect}
                    />
                </div>
            );
        }

        return (
            <div>
                {effectElements}
            </div>
        );
    }
}
