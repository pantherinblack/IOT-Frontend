const url = "http://80.208.228.90:8080/record/list?time=120000";

var chartDataRaw;
var chartData = {};



fetch(url, {
    method: 'GET',
    headers: {        'Content-Type': 'application/json'    }
})
    .then(response => {
        if (!response.ok) {
            //console.log(response);
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        //console.log(data)
        const newdat = { batteryv: [], humidity: [], temperature: []};
        chartDataRaw = data;

        for (const entry of data) {
            const ts = new Date(entry.timestamp).getTime();
            newdat["batteryv"].push([ts, entry.batteryv]);
            newdat["humidity"].push([ts, entry.humidity]);
            newdat["temperature"].push([ts, entry.temperature]);
            //console.log(newdat["batteryv"]);
            //console.log(newdat["humidity"]);
            var test = newdat["temperature"][1];
            console.log(test);
        }

        chartData = {newdat};



        var ctx = canvas.getContext('2d');
        var config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Graph Line',
                    data: data,
                    backgroundColor: 'rgba(0, 119, 204, 0.3)'
                }]
            }
        };

        var chart = new Chart(ctx, config);

    })
    .catch(error => {
        console.error(error);
    });


function setView(viewIndex) {
    if (viewIndex) {
        const data = chartData.absolute;
        updateSeries(data.feed, data.usg);
    } else {
        const data = chartData.relative;
        updateSeries(data.feed, data.usg);
    }
}

/**
 * updates the chart series
 * @param  {...any} newData new chart data
 */
function updateSeries(...newData) {
    const options = chart.series.map(({ name, color }) => {
        return { name, color };
    });
    //console.log(options);
    while (chart.series.length) {
        chart.series[0].remove();
    }
    for (const data of newData) {
        chart.addSeries({ ...options.shift(), data });
    }
}

const chart = Highcharts.stockChart("container", {
    chart: {
        zoomType: "x",
        panKey: "shift",
        panning: {
            enabled: true,
            type: "x",
        },
    },
    title: {
        text: "Stromzähler",
        y: 18,
    },
    rangeSelector: {
        floating: true,
        buttons: [
            {
                type: "day",
                count: 1,
                text: "1d",
            },
            {
                type: "week",
                count: 1,
                text: "1w",
            },
            {
                type: "month",
                count: 1,
                text: "1m",
            },
            {
                type: "month",
                count: 6,
                text: "6m",
            },
            {
                type: "year",
                count: 1,
                text: "1y",
            },
            {
                type: "all",
                text: "All",
            },
        ],
        selected: 2,
    },
    series: [
        { name: "Einspeisung", color: "#58508d" },
        { name: "Verbrauch", color: "#ff6361" },
    ],
    exporting: {
        buttons: {
            contextButton: {
                menuItems: [
                    {
                        textKey: "printChart",
                        onclick: function () {
                            this.print();
                        },
                    },
                    {
                        separator: true,
                    },
                    {
                        text: "Import XML",
                        onclick: function () {
                            document.querySelector("#file-input").click();
                            document
                                .querySelector("#file-input")
                                .addEventListener("change", () => {
                                    document
                                        .querySelector("#submit-btn")
                                        .click();
                                });
                        },
                    },
                    {
                        text: "Download CSV",
                        onclick: function () {
                            download("data.csv", jsonToCSV(chartDataRaw));
                        },
                    },
                    {
                        text: "Download JSON",
                        onclick: function () {
                            download(
                                "data.json",
                                JSON.stringify(chartDataRaw, null, 4)
                            );
                        },
                    },
                    {
                        separator: true,
                    },
                    {
                        textKey: "downloadPNG",
                        onclick: function () {
                            this.exportChart();
                        },
                    },
                    {
                        textKey: "downloadJPEG",
                        onclick: function () {
                            this.exportChart({
                                type: "image/jpeg",
                            });
                        },
                    },
                    {
                        separator: true,
                    },
                    {
                        textKey: "downloadPDF",
                        onclick: function () {
                            this.exportChart({
                                type: "application/pdf",
                            });
                        },
                    },
                    {
                        textKey: "downloadSVG",
                        onclick: function () {
                            this.exportChart({
                                type: "image/svg+xml",
                            });
                        },
                    },
                ],
            },
            nextMonth: {
                text: "month +",
                onclick: () => {
                    translateChart((date) => {
                        return date.setMonth(date.getMonth() + 1);
                    });
                },
            },
            nextDay: {
                text: "day +",
                onclick: () => {
                    translateChart((date) => date.setDate(date.getDate() + 1));
                },
            },
            prevDay: {
                text: "- day",
                onclick: () => {
                    translateChart((date) => date.setDate(date.getDate() - 1));
                },
            },
            prevMonth: {
                text: "- month",
                onclick: () => {
                    translateChart((date) =>
                        date.setMonth(date.getMonth() - 1)
                    );
                },
            },
            toggle: {
                text: "Toggle view",
                onclick: () => {
                    alert("toggling");
                },
                align: "left",
            },
        },
    },
    navigation: {
        buttonOptions: {
            align: "right",
        },
    },
    legend: {
        enabled: true,
    },
    tooltip: {
        formatter: function () {
            return this.points.reduce(function (s, point) {
                return `${s}<br/>${point.series.name} : ${point.y} kWh`;
            }, `<b>${new Date(this.x).toLocaleString()}</b>`);
        },
    },
});

/**
 * Translates the chart horizontally
 * @param {Function} changeFn
 * function that modifies the dateobj
 */
function translateChart(changeFn) {
    const { min, max } = chart.xAxis[0].getExtremes();
    chart.xAxis[0].setExtremes(
        changeFn(new Date(min)),
        changeFn(new Date(max))
    );
}

const select = Highcharts.createElement(
    "select",
    {
        onchange: function () {
            setView(this.selectedIndex);
        },
    },
    {
        position: "absolute",
        top: "11px",
        left: "10px",
        height: "24px",
    },
    document.querySelector("#container")
);

document.querySelector("#reload-btn").addEventListener("click", function () {
    this.innerHTML = "reloading...";
    this.classList.add("reloading");
    window.location = "/reload_json_data";
});

["relative Werte", "absolute Werte"].forEach((name) => {
    Highcharts.createElement(
        "option",
        { value: name, innerHTML: name },
        {},
        select
    );
});


