import * as Tone from "tone";

interface EffectConnection {
    name: string;
    enabled: boolean;
    node: Tone.ToneAudioNode;
    output?: string;
    input?: string;
}

const INPUT_NAME = "_input";
const OUTPUT_NAME = "_output";

export class EffectsRack {
    private readonly effects: Map<string, EffectConnection> = new Map<string, EffectConnection>();

    constructor(private readonly inputNode: Tone.ToneAudioNode, private readonly outputNode: Tone.ToneAudioNode) {
        this.effects.set(INPUT_NAME, {
            name: INPUT_NAME,
            node: inputNode,
            output: OUTPUT_NAME,
            enabled: true,
        });
        this.effects.set(OUTPUT_NAME, {
            name: OUTPUT_NAME,
            node: outputNode,
            input: INPUT_NAME,
            enabled: true,
        });
    }

    public add(name: string, effect: Tone.ToneAudioNode, input?: string) {
        const connection = { name, node: effect, input, enabled: true };
        const inputConnection = this.findNextInputConnection(connection);
        const outputConnection = this.findNextOutputConnection(inputConnection);

        inputConnection.node.disconnect(outputConnection.node);
        inputConnection.node.connect(effect);
        effect.connect(outputConnection.node);

        this.effects.set(inputConnection.name, { ...inputConnection, output: connection.name });
        this.effects.set(outputConnection.name, { ...outputConnection, input: connection.name });
        this.effects.set(name, { ...connection, input: inputConnection.name, output: outputConnection.name });
    }

    public disableEffect(name: string): void {
        const connection = this.effects.get(name);

        if (!connection) {
            throw new Error("No connection found.");
        }

        if (connection.enabled) {
            const inputConnection = this.findNextInputConnection(connection);
            const outputConnection = this.findNextOutputConnection(connection);

            connection.node.disconnect(outputConnection.node);
            inputConnection.node.disconnect(connection.node);
            inputConnection.node.connect(outputConnection.node);

            this.effects.set(name, { ...connection, enabled: false });
        }
    }

    public enableEffect(name: string): void {
        const connection = this.effects.get(name);

        if (!connection) {
            throw new Error("No connection found.");
        }

        if (!connection.enabled) {
            const inputConnection = this.findNextInputConnection(connection);
            const outputConnection = this.findNextOutputConnection(connection);

            inputConnection.node.disconnect(outputConnection.node);
            inputConnection.node.connect(connection.node);
            connection.node.connect(outputConnection.node);

            this.effects.set(name, { ...connection, enabled: true });
        }
    }

    private findNextInputConnection(connection: EffectConnection): EffectConnection {
        const inputConnection = this.effects.get(connection.input || INPUT_NAME);

        if (!inputConnection) {
            throw new Error("No input connection found.");
        }

        if (!inputConnection.enabled) {
            return this.findNextInputConnection(inputConnection);
        }

        return inputConnection;
    }

    private findNextOutputConnection(connection: EffectConnection): EffectConnection {
        const outputConnection = this.effects.get(connection.output || OUTPUT_NAME);

        if (!outputConnection) {
            throw new Error("No output connection found.");
        }

        if (!outputConnection.enabled) {
            return this.findNextOutputConnection(outputConnection);
        }

        return outputConnection;
    }
}
