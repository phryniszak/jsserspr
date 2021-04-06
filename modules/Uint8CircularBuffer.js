// it used as buffer (controller) for incoming serial data
// later shared between data view (chart, spreadsheet etc)
//

export class Uint8CircularBuffer extends EventTarget {
    constructor(size) {
        super();
        this._size = size;
        this.clear(true);
    }

    clear(init) {
        this._length = 0;
        if (init) {
            this.buffer = new Uint8Array(this._size);
        }
    }

    get length() {
        return this._length;
    }

    get size() {
        return this._size;
    }

    isEmpty() {
        return (this._length == 0);
    }

    isFull() {
        return (this._length == this._size);
    }

    freeSpace() {
        return (this._size - this._length);
    }

    queueString(str) {
        const encoder = new TextEncoder();
        const view = encoder.encode(str);
        this.queueArray(view);
    }

    queueArray(arr) {

        // cant place array bigger then buffer
        if (arr.length > this._size) {
            throw "array bigger then destination buffer";
        }

        // shift values
        // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
        this.buffer.copyWithin(0, arr.length);

        // place at the beginning
        this.buffer.set(arr, this._size - arr.length);

        // increase length
        this._length += arr.length;

        // clamp length to max value
        if (this._length > this._size) {
            this._length = this._size;
        }
    }

    queue(val) {

        // shift values
        // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
        this.buffer.copyWithin(0, 1);

        // place at the beginning
        this.buffer[this._size - 1] = val;

        // increase length
        if (this._length < this._size) {
            this._length++;
        }
    }

    getLast(n) {

        if (n) {
            return this.buffer.slice(this._size - Math.min(this._length, n));
        }

        return this.buffer.slice(this._size - this._length);
    }

    findString(str) {
        const encoder = new TextEncoder();
        const view = encoder.encode(str);
        return this.findArray(view);
    }

    findArray(arr) {

        // not enough elements to execute search or empty array
        if ((this._length < arr.length) || (arr.length == 0)) {
            return (-1);
        }

        for (let indexUp = arr.length; indexUp < (this._length + 1); indexUp++) {

            let startIndex = this._size - indexUp;
            let found = true;

            for (let index = 0; index < arr.length; index++) {
                if (arr[index] !== this.buffer[startIndex]) {
                    found = false;
                    break;
                }
                startIndex++;
            }

            // we found it !!!
            if (found) {
                return this._size - indexUp;
            }
        }

        // sorry, no...
        return -1;
    }
}