/*!
 * Copyright(c) 2022 Pawel Hryniszak
 */

export class Terminal extends EventTarget {

    constructor(el, buffer, maxChars) {
        super();
        this.buffer = buffer;
        this.maxChars = maxChars || 2000;

        el.innerHTML = `<div class="cell-block-y terminal" tabindex="0"><p></p><span></span>
        </div>`;
        this.el = el.firstElementChild;

        this.echoOFF = true;
        this.el.onkeydown = (ev) => {
            this.onKey(ev.key);
            ev.preventDefault();
        };
        this.el.keyup = (ev) => ev.preventDefault();

        this.el.focus();
    }

    destructor() {
        console.log("terminal destructor");
    }

    getASCIIfromKey(key) {
        const ascii = key.charCodeAt(0);
        if (key === String.fromCharCode(ascii)) {
            return ascii;
        }

        switch (key) {
            case "Enter":
                return 13;
            case "Backspace":
                return 8;
            case "Tab":
                return 9;
        }
    }

    onKey(key) {

        let ascii = this.getASCIIfromKey(key);

        if (ascii == undefined) {
            console.log(`onKey: ${key} unknown ASCII code`);
            return;
        }

        // create and dispatch the event
        var event = new CustomEvent("key", {
            detail: {
                ascii
            }
        });

        this.dispatchEvent(event);

        // echo to terminal?
        if (this.echoOFF) {
            return;
        }

        let printel = this.el.children[this.el.childElementCount - 2];

        switch (ascii) {
            case 13:
                printel.after(document.createElement("p"));
                break;
            case 32:
                printel.innerText += "\u00a0";
                break;

            default:
                printel.innerText += String.fromCharCode(ascii);
        }

        if (this.el.scrollTop != this.el.scrollHeight) {
            this.el.scrollTop = this.el.scrollHeight;
        }

        // TODO:
        // restart cursor
        // https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
    }

    resize() {
        this.el.scrollTop = this.el.scrollHeight;
    }

    writeln(data) {
        this.write(data);
        this.write("\n");
    }

    write(data) {
        setTimeout(() => this._innerWrite(data), 0);
    }

    _innerWrite(data) {

        const printel = this.el.children[this.el.childElementCount - 2];

        if (data instanceof Uint8Array || data instanceof Array) {
            data = this._ASCIIdecoderArr(data);
        } else if (typeof data !== "string") {
            console.log("unknown type", typeof data);
            return;
        }

        // if data > max
        if (data.length > this.maxChars) {
            printel.innerText = data.substring(data.length - this.maxChars);
        } else if (printel.innerText.length + data.length > this.maxChars) {
            printel.innerText = printel.innerText.substring(printel.innerText.length - this.maxChars + data.length) + data;
        } else {
            printel.innerText += data;
        }

        if (this.el.scrollTop != this.el.scrollHeight) {
            this.el.scrollTop = this.el.scrollHeight;
        }
    }

    _ASCIIdecoderArr(buff) {
        let str = "";
        for (let index = 0; index < buff.length; index++) {
            let char = buff[index];
            if (char == 0) {
                return str;
            }
            if (char == 32) {
                str += "\u00a0";
            } else {
                str += String.fromCharCode(char);
            }
        }
        // it shouldn't happen, string ending not found 
        return str;
    }
}
