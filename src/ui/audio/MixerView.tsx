import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {BusTrackView} from "./BusTrackView";
import {Meter} from "./Meter";
import {AudioEngine} from "../../audio/AudioEngine";
import {MasterOutputVolumeUpdatedEvent} from "../../audio/events/MasterOutputVolumeUpdatedEvent";

interface MixerViewProps {
    buses: Bus[]
    audioEngine: AudioEngine
}

export class MixerView extends React.Component<MixerViewProps, {}>
{
   public render() {
       const busTracks = this.props.buses.map((bus: Bus) => {
           return <BusTrackView key={bus.id} bus={bus}/>;
       });

       const leftMeterListener = (updateValue: (value: number) => void) => {
           this.props.audioEngine.emitter.on(MasterOutputVolumeUpdatedEvent, (event: MasterOutputVolumeUpdatedEvent) => {
               updateValue(event.leftVolume)
           });
       }

       const rightMeterListener = (updateValue: (value: number) => void) => {
           this.props.audioEngine.emitter.on(MasterOutputVolumeUpdatedEvent, (event: MasterOutputVolumeUpdatedEvent) => {
               updateValue(event.rightVolume)
           });
       }

       return (
           <div>
               {busTracks}
               <Meter style={{display: 'inline-block', margin: '10px'}} listener={leftMeterListener} />
               <Meter style={{display: 'inline-block', margin: '10px'}} listener={rightMeterListener} />
           </div>
       );
   }
}
