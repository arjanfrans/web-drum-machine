type MeterCanvasOptions = {
    maxValue?: number;
    minValue?: number;
    redThreshold: number;
    yellowThreshold: number;
    direction: "horizontal" | "vertical";
    width?: number;
    height?: number;
    boxes?: number;
    boxSpacing?: number;
    jitter?: number;
    value?: number;
};

export enum MeterCanvasDirection {
    horizontal = "horizontal",
    vertical = "vertical",
}

/**
 * Based on:
 *   - https://github.com/tomnomnom/vumeter
 */
export class MeterCanvas {
    public static readonly colors = {
        redOn: "rgba(255,47,30,0.9)",
        redOff: "rgba(64,12,8,0.9)",
        yellowOn: "rgba(255,215,5,0.9)",
        yellowOff: "rgba(64,53,0,0.9)",
        greenOn: "rgba(53,255,30,0.9)",
        greenOff: "rgba(13,64,8,0.9)",
    };

    private readonly redBoxIndex: number;
    private readonly yellowBoxIndex: number;

    private readonly boxHeight: number;
    private readonly boxWidth: number;
    private readonly boxSpacingX: number;
    private readonly boxSpacingY: number;
    private nextValue?: number;
    private currentValue: number;

    public readonly direction: string;
    public readonly maxValue: number;
    public readonly minValue: number;
    public readonly width: number;
    public readonly height: number;
    public readonly boxes: number;
    public readonly boxSpacing: number;
    public readonly jitter: number = 0;

    private readonly redThreshold: number;
    private readonly yellowThreshold: number;

    private static MAX = 1;
    private static MIN = 0;

    constructor(options?: MeterCanvasOptions) {
        this.maxValue = options?.maxValue || 100;
        this.minValue = options?.minValue || 0;

        this.boxes = options?.boxes || 25;
        this.boxSpacing = options?.boxSpacing || 0.2;
        this.jitter = options?.jitter || 0;
        this.redThreshold = options?.redThreshold || 0;
        this.yellowThreshold = options?.yellowThreshold || 0;
        this.direction = options?.direction || "horizontal";
        this.currentValue = this.normalizeValue(options?.value || this.minValue);

        this.width = options?.width || 20;
        this.height = options?.height || 100;

        this.boxHeight = this.height / (this.boxes + (this.boxes + 1) * this.boxSpacing);
        this.boxSpacingY = this.boxHeight * this.boxSpacing;

        this.boxWidth = this.width - this.boxSpacingY * 2;
        this.boxSpacingX = (this.width - this.boxWidth) / 2;

        this.redBoxIndex = Math.ceil(this.normalizeValue(this.redThreshold) * this.boxes);
        this.yellowBoxIndex = Math.ceil(this.normalizeValue(this.yellowThreshold) * this.boxes);
    }

    public set value(value: number) {
        this.nextValue = Math.round(1000 * this.normalizeValue(value)) / 1000;
    }

    /**
     * We need to scale the input value (0-max)
     * so that it fits into the number of boxes
     */
    private isBoxOn(index: number, value: number): boolean {
        const maxOn = Math.ceil((value / MeterCanvas.MAX) * this.boxes);

        return index <= maxOn;
    }

    private getBoxColor(index: number, value: number): string {
        if (index > this.redBoxIndex) {
            return this.isBoxOn(index, value) ? MeterCanvas.colors.redOn : MeterCanvas.colors.redOff;
        }

        if (index > this.yellowBoxIndex) {
            return this.isBoxOn(index, value) ? MeterCanvas.colors.yellowOn : MeterCanvas.colors.yellowOff;
        }

        return this.isBoxOn(index, value) ? MeterCanvas.colors.greenOn : MeterCanvas.colors.greenOff;
    }

    private applyJitter(value: number): number {
        if (this.jitter > 0 && value > MeterCanvas.MIN) {
            let amount = Math.random() * this.jitter * MeterCanvas.MAX;
            if (Math.random() > 0.5) {
                amount = -amount;
            }
            value += amount;
        }

        return value;
    }

    private drawBox(context: CanvasRenderingContext2D, value: number, index: number): void {
        index = Math.abs(index - (this.boxes - 1)) + 1;

        context.beginPath();

        if (this.direction === MeterCanvasDirection.horizontal) {
            context.rect(0, 0, this.boxHeight, this.boxWidth);
        } else {
            context.rect(0, 0, this.boxWidth, this.boxHeight);
        }

        context.fillStyle = this.getBoxColor(index, value);
        context.fill();

        if (this.direction === MeterCanvasDirection.horizontal) {
            context.translate(this.boxHeight + this.boxSpacingY, 0);
        } else {
            context.translate(0, this.boxHeight + this.boxSpacingY);
        }
    }

    private computeValue(value: number): number {
        const nextValue = this.nextValue || 0;

        // Gradual approach
        if (value <= nextValue) {
            value += (nextValue - value) / 5;
        } else {
            value -= (value - nextValue) / 5;
        }

        value = this.applyJitter(value);

        if (value < MeterCanvas.MIN) {
            value = MeterCanvas.MIN;
        }

        return value;
    }

    public draw(context: CanvasRenderingContext2D, frameCount: number): void {
        if (this.nextValue === undefined || this.currentValue !== this.nextValue) {
            const value = this.computeValue(this.currentValue);

            context.save();
            context.beginPath();

            if (this.direction === MeterCanvasDirection.horizontal) {
                context.rect(0, 0, this.height, this.width);
            } else {
                context.rect(0, 0, this.width, this.height);
            }

            context.fillStyle = "rgb(32,32,32)";
            context.fill();
            context.restore();
            context.save();
            context.translate(this.boxSpacingX, this.boxSpacingY);

            for (let i = 0; i < this.boxes; i++) {
                if (this.direction === MeterCanvasDirection.horizontal) {
                    this.drawBox(context, value, this.boxes - i);
                } else {
                    this.drawBox(context, value, i);
                }
            }

            context.restore();

            this.currentValue = Math.round(1000 * value) / 1000;
        }
    }

    private normalizeValue(value: number): number {
        return (value - this.minValue) / (this.maxValue - this.minValue);
    }
}