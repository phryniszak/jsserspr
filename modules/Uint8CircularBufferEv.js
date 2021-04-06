import { Uint8CircularBuffer } from "./Uint8CircularBuffer.js";

// https://gist.github.com/nmsdvid/8807205
const debounceEvent = (callback, time = 250, interval) =>
    (...args) =>
        clearTimeout(interval, interval = setTimeout(() => callback(...args), time));

export class Uint8CircularBufferEv extends Uint8CircularBuffer {
    constructor(size, debounceTime) {
        super(size);
        this.debounceTime = debounceTime || 100;
    }

    queueArrayEv(val) {
        super.queueArray(val);
        this.sendEvDebounced();
    }

    queueEv(val) {
        super.queue(val);
        this.sendEvDebounced();
    }

    sendEvDebounced = debounceEvent(() => {
        console.log("debounce", this)

        // create and dispatch the event
        var event = new CustomEvent("data", { detail: this });
        this.dispatchEvent(event);

    }, this.debounceTime);
}
