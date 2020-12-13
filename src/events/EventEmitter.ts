import { EventEmitter as BaseEventEmitter } from "events"

export class EventEmitter {
    private emitter = new BaseEventEmitter()

    public on(event: any, listener: (...args: any[]) => void): this {
        this.emitter.on(event.Name, listener)

        return this
    }

    public emit(event: any): void {
        console.debug(event)
        this.emitter.emit(event.constructor.Name, event)
    }

    public off(event: any, listener: (...args: any[]) => void): this {
        this.emitter.off(event.Name, listener)

        return this
    }
}
