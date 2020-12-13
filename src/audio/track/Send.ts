import * as Tone from "tone";
import { Bus } from "../bus/Bus";

export class Send {
    public readonly channel: Tone.Channel;
    private enabled: boolean = false;

    constructor(private readonly fromChannel: Tone.Channel, toBus: Bus) {
        this.channel = new Tone.Channel({
            context: fromChannel.context,
        });
        fromChannel.connect(this.channel);
        this.channel.connect(toBus.channel);

        this.disable();
        this.channel.volume.value = 0;
    }

    set volume(value: number) {
        this.channel.volume.value = Math.round(value);
    }

    get volume(): number {
        return Math.round(this.channel.volume.value);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public enable(): void {
        this.enabled = true;
        this.channel.mute = false;
    }

    public disable(): void {
        this.enabled = false;
        this.channel.mute = true;
    }
}
