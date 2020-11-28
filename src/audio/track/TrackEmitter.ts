import { Track } from "./Track";
import { EventEmitter } from "../../events/EventEmitter";
import { SetTrackNoteEvent } from "./events/SetTrackNoteEvent";
import { TrackEvent } from "./events/TrackEvent";
import { UpdateChannelVolumeEvent } from "./events/UpdateChannelVolumeEvent";
import { UpdateChannelPanningEvent } from "./events/UpdatePanningVolumeEvent";
import { SoloChannelEvent } from "./events/SoloChannelEvent";
import { MuteChannelEvent } from "./events/MuteChannelEvent";
import { SetChannelReverbEvent } from "./events/SetChannelReverbEvent";
import { SetChannelChorusEvent } from "./events/SetChannelChorusEvent";
import { UpdateSendVolumeEvent } from "./events/UpdateSendVolumeEvent";

export class TrackEmitter extends EventEmitter {
    constructor(private readonly track: Track) {
        super();

        this.on(SetTrackNoteEvent, (event: SetTrackNoteEvent) => {
            track.sequenceNotes[event.index] = event.isActive;

            this.emit(new TrackEvent(this.track));
        });

        this.on(UpdateChannelVolumeEvent, (event: UpdateChannelVolumeEvent) => {
            track.channel.volume.value = event.volume;
        });

        this.on(UpdateChannelPanningEvent, (event: UpdateChannelPanningEvent) => {
            track.channel.pan.value = event.pan;
        });

        this.on(SoloChannelEvent, (event: SoloChannelEvent) => {
            track.channel.solo = event.solo;

            this.emit(new TrackEvent(this.track));
        });

        this.on(MuteChannelEvent, (event: MuteChannelEvent) => {
            track.channel.mute = event.mute;

            this.emit(new TrackEvent(this.track));
        });

        this.on(SetChannelReverbEvent, (event: SetChannelReverbEvent) => {
            if (event.enable) {
                track.effectsRack.enableEffect("reverb");
            } else {
                track.effectsRack.disableEffect("reverb");
            }
        });

        this.on(SetChannelChorusEvent, (event: SetChannelChorusEvent) => {
            if (event.enable) {
                track.effectsRack.enableEffect("chorus");
            } else {
                track.effectsRack.disableEffect("chorus");
            }
        });

        this.on(UpdateSendVolumeEvent, (event: UpdateSendVolumeEvent) => {
            track.send(event.bus, event.volume);
        });
    }
}
