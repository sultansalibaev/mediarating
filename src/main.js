Array.prototype.join_title = function () {
    return [...this].map(item => ('• '+item)).join('\n');
}
Number.prototype.push_space = function () {
    return [...[...this.toString()].reverse().join('').match(/.{1,3}/g).join(' ')].reverse().join('')
}
String.prototype.push_space = function () {
    const temp_integer = parseInt(this);
    return isNaN(temp_integer) ? this : temp_integer.push_space()
}
const divider_obj = {
    1_000_000_000: ' млрд.',
    1_000_000: ' млн.',
    1: '',
}
Number.prototype.getFixedOne = function() {
    return parseInt((this) * 10) / 10
}
Number.prototype.short = function () {
    const one_billion = 1_000_000_000
    const one_million = 1_000_000
    let some_divider = this >= one_billion ? one_billion : this >= one_million ? one_million : 1;
    if (divider_obj[some_divider] == '') {
        return this.push_space()
    }
    else {
        return (this / some_divider).getFixedOne() + divider_obj[some_divider]
    }
}
String.prototype.short = function () {
    return parseInt(this).short()
}
String.prototype.maxLength = function (length) {
    if (this.trim().length <= length) return this.trim();
    else return this.trim().slice(0, length) + '...'
    // Crewmate WillThrowTheseHands
}

const dateTypes = {
    hour: "etHours",
    date: "etDate",
    "week-day": "etDay",
    month: "etMonth",
    year: "etFullYear",
};
const dateFormats = {
    Y: "getFullYear",
    m: "getMonth",
    d: "getDate",
    h: "getHours",
    i: "getMinutes",
    s: "getSeconds",
    w: "getDay",
};
const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];
const weeks = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
];

Date.prototype.plus = function (type, count) {
    this["s" + dateTypes[type]](this["g" + dateTypes[type]]() + count);
    return this
};
Date.prototype.minus = function (type, count) {
    this["s" + dateTypes[type]](this["g" + dateTypes[type]]() - count);
    return this
};
function getFormatDate(date) {
    if (date < 10) {
        return "0" + date;
    }
    return date;
}
String.prototype.format = function (format, bool) {
    return new Date(this).format(format, bool)
}
String.prototype.lowerIncludes = function (string) {
    return this.trim().toLowerCase().includes(string.trim().toLowerCase())
}
Date.prototype.format = function (format, bool) {
    return Object.keys(dateFormats).reduce((oldFormat, dateFormat) => {
        if (oldFormat.includes(dateFormat)) {
            let plus = 0;

            if (dateFormat == "m") {
                plus = 1;
            }

            let formatDate;

            if (dateFormat == "w") {
                formatDate = this[dateFormats[dateFormat]]();
                if (formatDate == 0) {
                    formatDate = 7
                }
                formatDate = bool ? weeks[this[dateFormats[dateFormat]]()] : formatDate;
            }
            else {
                let format_view = bool && dateFormat == 'm' ? months[this[dateFormats[dateFormat]]()] : plus + this[dateFormats[dateFormat]]();
                formatDate = format_view;
            }

            return oldFormat.replace(
                dateFormat,
                getFormatDate(formatDate)
            );
        } else {
            return oldFormat;
        }
    }, format);
};



import { createApp } from 'vue'
import App from './App.vue'

import { GridLayout, GridItem } from 'grid-layout-plus'
import './assets/tailwind.css'

import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import mapInit from "highcharts/modules/map";
import accessibilityInit from "highcharts/modules/accessibility";
import map_world from "@highcharts/map-collection/custom/world.geo.json";

mapInit(Highcharts);
accessibilityInit(Highcharts);

Highcharts.maps["map-world"] = map_world;

const app = createApp(App)

app.use(HighchartsVue);

app
    .component('GridLayout', GridLayout)
    .component('GridItem', GridItem)
    .mount('#app')
