document.addEventListener("DOMContentLoaded", () => {

let selectedButton = document.getElementById("lastMonthBtn");

const chooseDeviceDropdown = document.getElementById("choose-device");
const exportDropdown = document.getElementById("export");

// Fills Dropdown with devices
fetch("http://80.208.228.90:8080/device/list", {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
}).then(response => {
    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
}).then(data => {
    data.forEach(device => {
        const option = document.createElement("option");
        option.text = device.deviceName;
        option.value = device.deviceUUID;
        chooseDeviceDropdown.add(option);
    });
    // For testing
    const option = document.createElement("option");
    option.text = "Ertan";
    option.value = "023-8758604565";
    chooseDeviceDropdown.add(option);
}).catch(error => {
    console.error(error);
});


const b = document.getElementById("lastMonthBtn");
b.disabled = true;
createChart("http://80.208.228.90:8080/record/list?time=31");

function createChart(url) {
    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("data-length: " + data.length);
            const chartData = {};

            var timestamps = [];
            var temperatures = [];
            var humidity = [];
            var batteryv = [];

            for (var i = 0; i < data.length; i++) {
                if (data[i].device.deviceUUID == chooseDeviceDropdown.value) {
                    timestamps.push(new Date(data[i].timestamp));
                    temperatures.push(data[i].temperature);
                    humidity.push(data[i].humidity);
                    batteryv.push(data[i].batteryv);
                }
            }

            // sort the arrays by timestamps in ascending order
            var sortedIndex = timestamps.map((value, index) => [value, index])
                .sort(([a], [b]) => a - b)
                .map(([_, index]) => index);

            timestamps = sortedIndex.map(index => timestamps[index]);
            temperatures = sortedIndex.map(index => temperatures[index]);
            humidity = sortedIndex.map(index => humidity[index]);
            batteryv = sortedIndex.map(index => batteryv[index]);

            for (var i = 0; i < timestamps.length; i++) {
                var date = new Date(timestamps[i]);
                var formattedDate = date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
                timestamps[i] = formattedDate;
            }

            if(Chart.getChart("myChart") != null) {
                var chart = Chart.getChart("myChart");
                chart.data.datasets[0].data = temperatures;
                chart.data.datasets[1].data = humidity;
                chart.data.datasets[2].data = batteryv;
                chart.data.labels = timestamps;
                chart.update();
            } else {
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timestamps,
                        datasets: [{
                            label: 'Temperature (C)',
                            data: temperatures,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Humidity (%)',
                            data: humidity,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Battery Voltage (V)',
                            data: batteryv,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        hour: 'dd.MM.yyyy hh:mm'
                                    }
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Date'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temperature, Humidity, Battery Voltage'
                                }
                            }]
                        }
                    }
                });
            }
        });
}


    // Get the buttons by their ID
    const lastDayBtn = document.getElementById("lastDayBtn");
    const lastWeekBtn = document.getElementById("lastWeekBtn");
    const lastMonthBtn = document.getElementById("lastMonthBtn");
    const lastYearBtn = document.getElementById("lastYearBtn");
    const saveButton = document.getElementById("save");


    // Add event listeners to each button
    lastDayBtn.addEventListener("click", function() {
        // Handle click for "Last Day" button
        selectedButton = document.getElementById("lastDayBtn");
        lastDayBtn.disabled = true;
        lastWeekBtn.disabled = false;
        lastMonthBtn.disabled = false;
        lastYearBtn.disabled = false;
        createChart("http://80.208.228.90:8080/record/list?time=1");
    });

    lastWeekBtn.addEventListener("click", function() {
        // Handle click for "Last Week" button
        selectedButton = document.getElementById("lastWeekBtn");
        lastDayBtn.disabled = false;
        lastWeekBtn.disabled = true;
        lastMonthBtn.disabled = false;
        lastYearBtn.disabled = false;
        createChart("http://80.208.228.90:8080/record/list?time=7");
    });

    lastMonthBtn.addEventListener("click", function() {
        // Handle click for "Last Month" button
        selectedButton = document.getElementById("lastMonthBtn");
        lastDayBtn.disabled = false;
        lastWeekBtn.disabled = false;
        lastMonthBtn.disabled = true;
        lastYearBtn.disabled = false;
        createChart("http://80.208.228.90:8080/record/list?time=31");
    });

    lastYearBtn.addEventListener("click", function() {
        // Handle click for "Last Year" button
        selectedButton = document.getElementById("lastYearBtn");
        lastDayBtn.disabled = false;
        lastWeekBtn.disabled = false;
        lastMonthBtn.disabled = false;
        lastYearBtn.disabled = true;
        createChart("http://80.208.228.90:8080/record/list?time=365");
    });

    saveButton.addEventListener("click", function() {
        if(exportDropdown.value == "csv") {
            var canvas = document.getElementById("myChart");
            var image = canvas.toDataURL("image/png"); // get chart image data
            var data = image.replace(/^data:image\/png;base64,/, ""); // remove data URL header
            var chartData = atob(data); // convert base64-encoded data to binary data
            var parsedData = Papa.parse(chartData, {header: false}); // parse binary data to CSV format
            var csvData = parsedData.data.map(function(row) { return row.join(","); }).join("\n"); // convert CSV data to string
            var link = document.createElement("a");
            link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData));
            link.setAttribute("download", "chart-data.csv");
            link.click();


        } else if (exportDropdown.value == "xlsx") {
            var canvas = document.getElementById("myChart");
            var base64Data = canvas.toDataURL("image/png").split(",")[1];
            var binaryData = atob(base64Data);
            var dataArray = Papa.parse(binaryData, {header: false}).data;

            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.aoa_to_sheet(dataArray);
            XLSX.utils.book_append_sheet(wb, ws, "Chart Data");

            var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
            var link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", "chart-data.xlsx");
            link.click();
        }
    });

    chooseDeviceDropdown.addEventListener("change", function() {
        // code to execute when the dropdown selection changes
        if(selectedButton == document.getElementById("lastDayBtn")) {
            createChart("http://80.208.228.90:8080/record/list?time=1");
        }else if(selectedButton == document.getElementById("lastWeekBtn")) {
            createChart("http://80.208.228.90:8080/record/list?time=7");
        }else if(selectedButton == document.getElementById("lastMonthBtn")) {
            createChart("http://80.208.228.90:8080/record/list?time=31");
        }else if(selectedButton == document.getElementById("lastYearBtn")) {
            createChart("http://80.208.228.90:8080/record/list?time=365");
        }
    });

});


// Old Code
// Creates Chart with Standard last Month
/*
fetch(url, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
})
.then(response => {
    if (!response.ok) {
        //console.log(response);
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
})
.then(data => {
    const chartData = {};

    var timestamps = [];
    var temperatures = [];
    var humidity = [];
    var batteryv = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].device.deviceUUID == dropdown.value) {
            console.log(data[i].device.deviceUUID);
            timestamps.push(new Date(data[i].timestamp));
            temperatures.push(data[i].temperature);
            humidity.push(data[i].humidity);
            batteryv.push(data[i].batteryv);
        }
    }


    // sort the arrays by timestamps in ascending order
    var sortedIndex = timestamps.map((value, index) => [value, index])
        .sort(([a], [b]) => a - b)
        .map(([_, index]) => index);

    timestamps = sortedIndex.map(index => timestamps[index]);
    temperatures = sortedIndex.map(index => temperatures[index]);
    humidity = sortedIndex.map(index => humidity[index]);
    batteryv = sortedIndex.map(index => batteryv[index]);

    console.log("min: " + timestamps[0]);
    console.log("max: " + timestamps[timestamps.length - 1]);

    for (var i = 0; i < timestamps.length; i++) {
        var date = new Date(timestamps[i]);
        var formattedDate = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        timestamps[i] = formattedDate;
    }
    // diasble Month button
    document.getElementById("lastMonthBtn").disabled = true;
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Temperature (C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Humidity (%)',
                data: humidity,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Battery Voltage (V)',
                data: batteryv,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: 'dd.MM.yyyy hh:mm'
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature, Humidity, Battery Voltage'
                    }
                }]
            }
        }
    });
});
 */