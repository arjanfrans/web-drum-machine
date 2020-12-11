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
    }

    set volume(value: number) {
        this.channel.volume.value = value;
    }

    get volume(): number {
        return this.channel.volume.value;
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
