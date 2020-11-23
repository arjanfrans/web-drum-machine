import { EventEmitter as BaseEventEmitter } from "events";

export class EventEmitter {
    private emitter = new BaseEventEmitter();

    public on(event: any, listener: (...args: any[]) => void): this {
        this.emitter.on(event.name, listener);

        return this;
    }

    public emit(event: any): void {
        this.emitter.emit(event.constructor.name, event);
    }

    public off(event: any, listener: (...args: any[]) => void): this {
        this.emitter.off(event, listener);

        return this;
    }
}
