import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {BusTrackView} from "./BusTrackView";

interface MixerViewProps {
    buses: Bus[]
}

export class MixerView extends React.Component<MixerViewProps, {}>
{
   public render() {
       const busTracks = this.props.buses.map((bus: Bus) => {
           return <BusTrackView key={bus.id} bus={bus}/>;
       });

       return (
           <table>
               <tbody>
                   <tr>
                       {busTracks}
                   </tr>
               </tbody>
           </table>
       );
   }
}
