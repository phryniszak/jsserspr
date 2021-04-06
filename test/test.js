import { Uint8CircularBuffer } from "../modules/Uint8CircularBuffer.js";

const STR_SAMPLE = `shell> 
shell> 
shell> 
shell> 
shell> print 1
> OK, 1
shell> 0,818,0,1
9,822,0,1
18,827,0,1
27,832,0,1
37,837,0,1
46,842,0,1
56,847,0,1
66,852,0,1
75,857,0,1
85,861,0,1
94,866,0,1
104,871,0,1
114,877,0,1
125,882,0,1
135,888,0,1
145,893,0,1
156,898,0,1
166,904,0,1
177,909,0,1
187,915,0,1
198,920,0,1
208,925,0,1
218,931,0,1
229,936,0,1
239,942,0,1
250,947,0,1
260,952,0,1
271,958,0,1
281,963,0,1
291,969,0,1
302,974,0,1
312,979,0,1
323,985,0,1
333,990,0,1
343,996,0,1
354,1001,0,1
365,1007,0,1
376,1013,0,1
388,1019,0,1
399,0,0,1
408,4,0,1
416,9,0,1
425,13,0,1
435,18,0,1
444,23,0,1
454,28,0,1
463,33,0,1
473,38,0,1
482,43,0,1
492,48,0,1
501,53,0,1
511,58,0,1
521,63,0,1
530,68,0,1
540,72,0,1
549,77,0,1
559,82,0,1
568,87,0,1
578,92,0,1
587,97,0,1
597,102,1,0
607,108,1,0
618,113,1,0
628,118,1,0
639,124,1,0
649,129,1,0
659,135,1,0
670,140,1,0
680,145,1,0
691,151,1,0
701,156,1,0
712,162,1,0
722,167,1,0
732,172,1,0
743,178,1,0
753,183,1,0
764,189,1,0
774,194,1,0
784,200,1,0
795,205,1,0
805,210,1,0
816,216,1,0
826,221,1,0
837,227,1,0
847,232,1,0
857,237,1,0
868,243,1,0
878,248,1,0
889,254,1,0
899,259,1,0
910,264,1,0
920,270,1,0
930,275,1,0
941,281,1,0
951,286,1,0
962,291,1,0
972,297,1,0
982,302,1,0
993,308,1,0
1003,313,1,0
1015,319,1,0
1026,325,1,0
1037,331,1,0
1048,336,1,0
1060,342,1,0
1071,348,1,0
1082,354,1,0
1094,360,1,0
1105,366,1,0
1116,372,1,0
1127,377,1,0
1139,383,1,0
1150,389,1,0
1161,395,1,0
1173,401,1,0
1184,407,1,0
1195,413,1,0
1206,418,1,0
1218,424,1,0
1229,430,1,0
1240,436,1,0
1252,442,1,0
`;

///////////////////////////////////////////////////////////////////////////////
// VARIABLES

// elements
const btnTest = document.getElementById("btn_start_test");

///////////////////////////////////////////////////////////////////////////////
// CONSTANT

const redColor = "background:red;color:black";
const greenColor = "background:green;color:black";

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

function later(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/G(lobal_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function CHECK(res, description) {
    if (res == true) {
        console.log(`%cOK: ${description}`, greenColor);
    } else {
        console.log(`%cFAIL: ${description}`, redColor);
    }
}

const test1 = (bufferSize) => {

    console.log("TEST 1 STARTED");

    let buffer = new Uint8CircularBuffer(bufferSize);

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);
    console.log("isFull()");

    let isFullTest = true;
    for (let index = 0; index < (buffer.size * 2); index++) {
        if (index < (buffer.size)) {
            // it should report not full, up tu buffer size
            if (buffer.isFull() == true) {
                isFullTest = false;
                break;
            }
        } else {
            // now is full
            if (buffer.isFull() == false) {
                isFullTest = false;
                break;
            }
        }

        buffer.queue(index);
    }

    CHECK((isFullTest), "test isFull()");

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);
    console.log("isEmpty()");

    let isEmptyTest = true;
    for (let index = 0; index < (buffer.size * 2); index++) {
        if (index == 0) {
            // only for index 0 we should have empty buffer
            if (buffer.isEmpty() == false) {
                isEmptyTest = false;
                break;
            }
        } else {
            if (buffer.isEmpty() == true) {
                isEmptyTest = false;
                break;
            }
        }

        buffer.queue(index);
    }

    CHECK((isEmptyTest), "test isEmpty()");

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);
    console.log("length");

    let lengthTest = true;
    for (let index = 0; index < (buffer.size * 2); index++) {
        if (index < buffer.size) {
            // up to buffer size we should report number item equal to index
            if (buffer.length !== index) {
                lengthTest = false;
                break;
            }
        } else {
            // now number items is equal to buffer size
            if (buffer.length !== buffer.size) {
                lengthTest = false;
                break;
            }
        }

        buffer.queue(index);
    }

    CHECK((lengthTest), "test length");

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);
    console.log("freeSpace()");

    let freeSpaceTest = true;
    for (let index = 0; index < (buffer.size * 2); index++) {
        if (index < buffer.size) {
            // up to buffer size we should report number item equal to index
            if (buffer.freeSpace() !== (buffer.size - index)) {
                freeSpaceTest = false;
                break;
            }
        } else {
            // now number items is equal to buffer size
            if (buffer.freeSpace() !== 0) {
                freeSpaceTest = false;
                break;
            }
        }

        buffer.queue(index);
    }

    CHECK((freeSpaceTest), "test freeSpace()");

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);

    console.log("getLast() size/2");
    let peekAllLastTest = true;
    let arr = [];

    // save elements
    for (let index = 0; index < (buffer.size / 2); index++) {
        let val = getRandomInt(0, 256);
        buffer.queue(val);
        arr.push(val);
    }

    // get it back
    let arrRes = buffer.getLast();

    // compare
    for (let index = 0; index < (buffer.size / 2); index++) {
        if (arr[index] !== arrRes[index]) {
            peekAllLastTest = false;
            break;
        }
    }

    CHECK((peekAllLastTest), "test getLast() size/2");

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);

    console.log("getLast() size * 2");
    peekAllLastTest = true;
    arr = [];

    // save elements
    for (let index = 0; index < (buffer.size * 2); index++) {
        let val = getRandomInt(0, 256);
        buffer.queue(val);
        arr.push(val);
    }

    // get it back
    arrRes = buffer.getLast();

    // trim reference array
    arr = arr.slice(arr.length - arrRes.length);

    // compare
    for (let index = 0; index < arrRes.length; index++) {
        if (arr[index] !== arrRes[index]) {
            peekAllLastTest = false;
            break;
        }
    }

    CHECK((peekAllLastTest), "test getLast() size * 2");

    ///////////////////////////////////////////////////////////////////////////

    console.log("TEST 1 FINISHED");
};


const test2 = (bufferSize) => {
    console.log("TEST 2 STARTED");

    let buffer = new Uint8CircularBuffer(bufferSize);

    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);

    console.log("test 1 array write/read - getLast(n)");
    let rwa = true;

    // create array
    let arrSize = getRandomInt(0, buffer.size);
    let arr = new Uint8Array(arrSize);

    // fill with values
    for (let index = 0; index < arrSize; index++) {
        let val = getRandomInt(0, 256);
        arr[index] = val;
    }

    // write it
    buffer.queueArray(arr);

    // get it back
    let arrRes = buffer.getLast(arrSize);

    // compare
    for (let index = 0; index < arrSize; index++) {
        if (arr[index] !== arrRes[index]) {
            rwa = false;
            break;
        }
    }

    CHECK(rwa, "test 1 array write/read");


    ///////////////////////////////////////////////////////////////////////////
    buffer.clear(true);

    console.log("test 2 array write/read  - getLast()");
    rwa = true;

    // fill with values
    for (let index = 0; index < arrSize; index++) {
        let val = getRandomInt(0, 256);
        arr[index] = val;
    }

    // write it
    buffer.queueArray(arr);

    // get it back
    arrRes = buffer.getLast();

    // compare
    for (let index = 0; index < arrSize; index++) {
        if (arr[index] !== arrRes[index]) {
            rwa = false;
            break;
        }
    }

    CHECK(rwa, "test 2 array write/read");

    ///////////////////////////////////////////////////////////////////////////

    console.log("TEST 2 FINISHED");

};

const test3 = (bufferSize) => {

    console.log("TEST 3 STARTED");


    ///////////////////////////////////////////////////////////////////////////
    let buffer = new Uint8CircularBuffer(6);
    buffer.queueString("aabc");
    let res = buffer.findString("aa");
    CHECK(res == 2, "aa in aabc");
    res = buffer.findString("a");
    CHECK(res == 3, "a in aabc");
    res = buffer.findString("-");
    CHECK(res == -1, "- in aabc");

    ///////////////////////////////////////////////////////////////////////////
    buffer = new Uint8CircularBuffer(bufferSize);
    buffer.queueString(STR_SAMPLE);
    res = buffer.findString("print 1");
    CHECK(res !== -1, "print 1");

    console.log("TEST 3 FINISHED");

};

///////////////////////////////////////////////////////////////////////////////
// EVENTS

// click to start test
btnTest.onclick = () => {
    // test1(13);
    // test2(32);
    test3(1024 * 512);
};