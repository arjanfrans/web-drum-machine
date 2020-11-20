export class BufferLoader {
    private bufferList: Map<string, AudioBuffer> = new Map<
        string,
        AudioBuffer
    >();

    constructor(
        private context: AudioContext,
        private urlList: Map<string, string>
    ) {}

    public async load(): Promise<Map<string, AudioBuffer>> {
        for (const [name, url] of this.urlList.entries()) {
            const buffer = await this.loadBuffer(url);

            this.bufferList.set(name, buffer);
        }

        return this.bufferList;
    }

    private async loadBuffer(url: string): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            // Load buffer asynchronously
            const request = new XMLHttpRequest();

            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = () => {
                // Asynchronously decode the audio file data in request.response
                this.context.decodeAudioData(
                    request.response,
                    (buffer: AudioBuffer) => {
                        if (!buffer) {
                            return reject(
                                new Error("error decoding file data: " + url)
                            );
                        }

                        return resolve(buffer);
                    },
                    (error) => {
                        return reject(error);
                    }
                );
            };

            request.onerror = () => {
                return reject("BufferLoader: XHR error");
            };

            request.send();
        });
    }
}
