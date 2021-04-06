import { Terminal } from "./modules/terminal.js";
import { Table } from "./modules/table.js";
import { Chart } from "./modules/chart.js";
import { Uint8CircularBufferEv } from "./modules/Uint8CircularBufferEv.js";

document._my_ = {};

document._my_.btnConnect = document.getElementById("open-serial");
document._my_.btnTerminal = document.getElementById("open-terminal");
document._my_.btnTable = document.getElementById("open-table");
document._my_.btnChart = document.getElementById("open-chart");
document._my_.btnCmd = document.getElementById("command-btn");
document._my_.inpCmd = document.getElementById("command-input");
document._my_.elMain = document.getElementById("main");
const SERIAL_BUFF_SIZE = (512 * 1024);
const SERIAL_DELAY_TIME = 10;
const BUFF_EV_DEBOUNCE_TIME = SERIAL_DELAY_TIME * 5;

document._my_.activeMode = null;
document._my_.serialPort;
document._my_.buffer = new Uint8CircularBufferEv(SERIAL_BUFF_SIZE, BUFF_EV_DEBOUNCE_TIME);

const resize = () => {
    if (document._my_.activeMode && document._my_.activeMode.resize) {
        document._my_.activeMode.resize();
    }
};

function later(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

async function connectSerial() {
    document._my_.serialPort = await navigator.serial.requestPort({});
    await document._my_.serialPort.open({ baudRate: 1000000, bufferSize: SERIAL_BUFF_SIZE / 2 });
    uiConnected(true);
    readSerial();
}

async function readSerial() {
    while (document._my_.serialPort && document._my_.serialPort.readable) {
        let reader;
        try {
            reader = document._my_.serialPort.readable.getReader();
            for (; ;) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }

                // wait little
                await later(SERIAL_DELAY_TIME);

                // send to buffer
                document._my_.buffer.queueArrayEv(value);

                // send to view
                if (document._my_.activeMode && document._my_.activeMode.write) {
                    document._my_.activeMode.write(value);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            reader.releaseLock();
        }
    }
}

async function writeSerialByte(ch) {
    if (document._my_.serialPort && document._my_.serialPort.writable) {
        const writer = document._my_.serialPort.writable.getWriter();
        try {
            const bytes = new Uint8Array([ch]);
            await writer.write(bytes);
        } catch (error) {
            // Handle |error|...
            console.log(error);
        } finally {
            writer.releaseLock();
        }
    }
}

async function serialWriteString(data) {
    const encoder = new TextEncoder();
    const dataArrayBuffer = encoder.encode(data);

    if (document._my_.serialPort && document._my_.serialPort.writable) {
        const writer = document._my_.serialPort.writable.getWriter();
        try {
            await writer.write(dataArrayBuffer);
        } catch (error) {
            // Handle |error|...
            console.log(error);
        } finally {
            writer.releaseLock();
        }
    }
}

const uiInit = () => {
    resize();

    // Caution: I am telling you this as a friend. It exists. It is a thing, but it is a hack. Please don't use it
    window.scrollTo(0, 1);
};

const uiConnected = (connected) => {
    // save state in serial object
    navigator.serial.connected = connected;

    // activate/deactivate UI
    document._my_.btnCmd.disabled = !connected;
    document._my_.inpCmd.disabled = !connected;

    if (connected) {
        document._my_.btnConnect.classList.add("success");
    }
    else {
        document._my_.btnConnect.classList.remove("success");
    }
};

///////////////////////////////////////////////////////////////////////////////
// EVENTS

window.onresize = resize;

// https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
window.addEventListener("load", uiInit);

navigator.serial.ondisconnect = () => uiConnected(false);

// click on serial port open
document._my_.btnConnect.onclick = async () => {
    console.log("open serial port");

    if (!navigator.serial) {
        console.log("Web Serial API not supported.");
        return;
    }

    connectSerial();
};

// switch to terminal
document._my_.btnTerminal.onclick = () => {
    console.log("open terminal");

    if (document._my_.activeMode instanceof Terminal) {
        document._my_.activeMode.el.focus();
        return;
    }

    if (document._my_.activeMode && document._my_.activeMode.destructor) {
        document._my_.activeMode.destructor();
    }

    document._my_.activeMode = new Terminal(document._my_.elMain, document._my_.buffer);

    document._my_.activeMode.addEventListener("key", async (ev) => {
        console.log("key");
        await writeSerialByte(ev.detail.ascii);
    });
};

// switch to table
document._my_.btnTable.onclick = () => {
    console.log("open table");

    if (document._my_.activeMode instanceof Table) {
        return;
    }

    if (document._my_.activeMode && document._my_.activeMode.destructor) {
        document._my_.activeMode.destructor();
    }

    document._my_.activeMode = new Table(document._my_.elMain, document._my_.buffer);
};

// switch to chart
document._my_.btnChart.onclick = () => {
    console.log("open chart");

    if (document._my_.activeMode instanceof Chart) {
        return;
    }

    if (document._my_.activeMode && document._my_.activeMode.destructor) {
        document._my_.activeMode.destructor();
    }

    document._my_.activeMode = new Chart(document._my_.elMain, document._my_.buffer);
};

// write on button pressed
document._my_.btnCmd.onclick = () => {
    let str = document._my_.inpCmd.value;
    if (str !== "") {
        serialWriteString(str + "\n");
    }
};

// write on ENTER in input
document._my_.inpCmd.onkeypress = (ev) => {
    let str = document._my_.inpCmd.value;
    if (ev.keyCode === 13 && str !== "") {
        serialWriteString(str + "\n");
    }
};