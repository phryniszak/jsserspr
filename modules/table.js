/*!
 * Copyright(c) 2022 Pawel Hryniszak
 */

import { getSample, getSampleInfo } from "./sample.js";

export class Table extends EventTarget {

    constructor(el, buffer) {
        super();
        this.buffer = buffer;

        el.innerHTML = "<div></div>";
        this.el = el.firstElementChild;
        this.el.classList.add("table");

        this.buffer.addEventListener("data", this.data_listener);

        this.update();
    }

    data_listener = (e) => {
        this.update();
    }

    destructor() {
        console.log("table destructor");
        this.buffer.removeEventListener("data", this.data_listener);
    }

    resize() {

    }

    populateTable(rows, cells, content, header) {

        let is_func = (typeof content === "function");
        let is_func_header = (typeof header === "function");

        let table = document.createElement("table");
        table.classList.add("hover");

        let tblBody = table.createTBody();

        // header
        if (header && (!table.tHead)) {
            let tblHead = table.createTHead();
            let row = tblHead.insertRow();
            for (let j = 0; j < cells; ++j) {
                row.insertCell(j).innerHTML = is_func_header ? header(tblHead, j) : header[j];
            }
        }

        // rows
        for (let i = 0; i < rows; ++i) {
            let row = tblBody.insertRow();
            for (let j = 0; j < cells; ++j) {
                row.insertCell(j).innerHTML = is_func ? content(row, i, j) : content[i][j];
            }
            tblBody.appendChild(row);
        }

        this.el.replaceChildren(table);
    }

    update() {
        let sample = getSample(this.buffer);
        let info = getSampleInfo();

        // if (!sample.length) {
        //     sample = [[1, 2, 3, 100], [4, 5, 6, 100], [7, 8, 9, 100]];
        // }

        let header = info.table_header;
        if (!header) {
            header = ["coll 1", "coll 2", "coll 3", "coll 4", "coll 5"];
        }

        if (sample.length) {
            console.log("updated table");
            this.populateTable(sample.length, sample[0].length, sample, header);
        }
    }
}