import { nameColors } from "./colors.js";

const START_SAMPLE_STR = "print 1\r\n> OK, 1\r\nshell>";
const SPLIT_LIMES = 32; // space

const getSample = (buffer) => {

    const startPos = buffer.findString(START_SAMPLE_STR);
    const resultArray = [];

    // not found
    if (startPos < 0) return resultArray;

    // get buffer with samples
    let sampleBuff = buffer.buffer.slice(startPos + START_SAMPLE_STR.length);

    // split in lines
    let start = 0;
    let stop = 0;
    let splitMark = true;
    let utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'

    sampleBuff.forEach((element, index) => {
        // 32 - space
        if (!splitMark && element <= SPLIT_LIMES) {
            stop = index;
            splitMark = true;
            let rowArray = [];
            let rowLine = utf8decoder.decode(sampleBuff.slice(start, stop));
            rowLine.split(",").forEach(function (cell) {
                rowArray.push(cell);
            });
            resultArray.push(rowArray);
        } else if (splitMark && element > SPLIT_LIMES) {
            start = index;
            splitMark = false;
        }
    });

    return resultArray;
};


const getSampleInfo = () => {
    const info = {};
    info.table_header = ["index", "ts", "M1_PWM_UL", "M1_PWM_WL"];

    // https://echarts.apache.org/en/option.html#dataset.dimensions
    // https://echarts.apache.org/en/tutorial.html#ECharts%20Basic%20Concepts%20Overview
    info.chart_option = {
        // dataset: {
        //     source: null,
        //     dimensions: [
        //         { name: "timestamp", type: "int" },
        //         { name: "col1", type: "int" },
        //         { name: "col2", type: "int" },
        //         { name: "col3", type: "int" },],
        // },
        xAxis: {
            type: "value",
            name: "time"
        },
        yAxis: [
            {
                type: "value",
                min: 0,
                max: 1050,
                // position: "left",
                // axisLine: {
                //     show: true,
                //     lineStyle: {
                //         color: colors[0]
                //     }
                // },
                // axisLabel: {
                //     formatter: '{value} ml'
                // }
                show: false
            },
            {
                type: "value",
                min: -1,
                max: 9,
                // position: "left",
                // offset: 80,
                // axisLine: {
                //     show: true,
                //     lineStyle: {
                //         color: colors[1]
                //     }
                // },
                // axisLabel: {
                //     formatter: '{value} ml'
                // }
                show: false
            },
            {
                type: "value",
                min: -3,
                max: 7,
                show: false
            },
            // {
            //     type: "value",
            //     min: -5,
            //     max: 5,
            //     show: false
            // },
            // {
            //     type: "value",
            //     min: -7,
            //     max: 3,
            //     show: false
            // }
        ],
        series: [
            {
                type: "line",
                name: info.table_header[1],
                showSymbol: false,
                encode: { x: 0, y: 1 },
                yAxisIndex: 0
            },
            {
                type: "line",
                name: info.table_header[2],
                showSymbol: false,
                encode: { x: 0, y: 2 },
                yAxisIndex: 1
            },
            {
                type: "line",
                name: info.table_header[3],
                showSymbol: false,
                encode: { x: 0, y: 3 },
                yAxisIndex: 2
            },
            // {
            //     type: "line",
            //     name: info.table_header[4],
            //     showSymbol: false,
            //     encode: { x: 0, y: 4 },
            //     yAxisIndex: 3
            // },
            // {
            //     type: "line",
            //     name: info.table_header[5],
            //     showSymbol: false,
            //     encode: { x: 0, y: 5 },
            //     yAxisIndex: 4
            // }
        ],
        tooltip: {
            trigger: "axis",
            position: function (pt) {
                return [pt[0], "10%"];
            }
        },
        dataZoom: [{
            type: "inside",
            start: 0,
            end: 50
        }, {
            start: 0,
            end: 10
        }],
        legend: {},
        color: [nameColors.aqua, nameColors.coral, nameColors.firebrick, nameColors.indianred, nameColors.limegreen],
        grid: {
            left: 20,
            right: 50
        }
    };

    info.chart_data = {
        dataset: {
            source: null,
            dimensions: [
                { name: "timestamp", type: "int" },
                { name: "col1", type: "int" },
                { name: "col2", type: "int" },
                { name: "col3", type: "int" },
                // { name: "col4", type: "int" },
                // { name: "col5", type: "int" }
            ],
        },
    };

    return info;
};

export { getSample, getSampleInfo };
