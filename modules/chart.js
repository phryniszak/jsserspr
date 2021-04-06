/*!
 * Copyright(c) 2022 Pawel Hryniszak
 */

import { getSample, getSampleInfo } from "./sample.js";

export class Chart extends EventTarget {

    constructor(el, buffer) {
        super();
        this.buffer = buffer;

        el.innerHTML = "<div></div>";
        this.el = el.firstElementChild;
        this.el.classList.add("chart");

        // based on prepared DOM, initialize echarts instance
        this.chart = echarts.init(this.el);
        // set chart options
        let chart_option = getSampleInfo().chart_option;
        this.chart.setOption(chart_option);

        this.buffer.addEventListener("data", this.data_listener);

        this.update();
    }

    data_listener = (e) => {
        this.update();
    }

    destructor() {
        console.log("chart destructor");
        this.buffer.removeEventListener("data", this.data_listener);
    }

    resize() {
        this.chart.resize();
    }

    update() {
        const sample = getSample(this.buffer);
        if (sample.length) {
            console.log("updated chart");
            const data = getSampleInfo().chart_data;
            data.dataset.source = sample;
            this.chart.setOption(data);
        }
    }
}