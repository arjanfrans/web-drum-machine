import * as Tone from "tone"
import { Bus } from "../bus/Bus"

export class Send {
    public readonly channel: Tone.Channel
    private enabled: boolean = false

    constructor(private readonly fromChannel: Tone.Channel, private readonly toBus: Bus) {
        this.channel = new Tone.Channel({
            context: fromChannel.context,
        })
    }

    set volume(value: number) {
        value = Math.round(value)

        this.channel.volume.value = value
    }

    get volume(): number {
        return this.channel.volume.value
    }

    public isEnabled(): boolean {
        return this.enabled
    }

    public enable(): void {
        this.enabled = true

        this.fromChannel.connect(this.channel)
        this.channel.connect(this.toBus.channel)
    }

    public disable(): void {
        this.enabled = false

        this.fromChannel.disconnect(this.channel)
        this.channel.disconnect(this.toBus.channel)
    }
}
