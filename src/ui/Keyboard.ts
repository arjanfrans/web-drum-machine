class KeyboardInstance {
    private shiftDown: boolean = false;

    public isShiftDown(): boolean {
        return this.shiftDown;
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.shiftDown = event.shiftKey;
    }

    public onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = event.shiftKey;
    }
}

export const Keyboard = new KeyboardInstance();

window.addEventListener(
    "keyup",
    (event) => {
        Keyboard.onKeyUp(event);
        event.preventDefault();
    },
    false
);

window.addEventListener(
    "keydown",
    (event) => {
        Keyboard.onKeyDown(event);
        event.preventDefault();
    },
    false
);
