const url = "http://80.208.228.90:8080/record/list?time=120000";

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
        /*
        console.log(data)
        console.log("recordUUID: " + data[0].recordUUID); // "cd01e9a0-955e-4ec2-8c32-5eac4e414f8c"
        console.log("deviceUUID: " + data[0].deviceUUID); // "eui-a840417ee185f0b5"
        console.log("timestamp: " + data[0].timestamp); // 1681386701000
        console.log("temperature: " + data[0].temperature); // 15.7
        console.log("humidity: " + data[0].humidity); // 38.2
        console.log("battery: " + data[0].batteryv); // 3.663
        console.log("deviceUUID: " + data[0].device.deviceUUID); // "eui-a840417ee185f0b5"
        console.log("deviceName: " + data[0].device.deviceName); // "LSN50v2-30B"
        console.log("device-latitude: " + data[0].device.latitude); // 47.35004
        console.log("device-longitude: " + data[0].device.longitude); // 8.719297
         */
        const chartData = {};

        /*
        const chartOptions = {
            scales: {
                xAxes: [{
                    type: 'timestamp',
                    time: {
                        unit: 'minute'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
        const chartConfig = {
            type: 'line',
            options: chartOptions
        };
         */

        var timestamps = [];
        var temperatures = [];
        var humidity = [];
        var batteryv = [];

        for (var i = 0; i < data.length; i++) {
            timestamps.push(new Date(data[i].timestamp));
            temperatures.push(data[i].temperature);
            humidity.push(data[i].humidity);
            batteryv.push(data[i].batteryv);
        }

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
                    borderWidth: 1,
                    yAxisID: 'temperature'
                }, {
                    label: 'Humidity (%)',
                    data: humidity,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'humidity'
                }, {
                    label: 'Battery Voltage (V)',
                    data: batteryv,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    yAxisID: 'batteryv'
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                hour: 'MMM D, hA'
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
                            labelString: 'Temperature (C)'
                        }
                    }]
                }
            }
        });


    });

/* Old Code builds chart
        // group data by deviceUUID
        data.forEach(record => {
            if (!chartData[record.deviceUUID]) {
                chartData[record.deviceUUID] = {
                    temperature: [],
                    humidity: [],
                    batteryv: [],
                };
            }
            //console.log(chartData[record.deviceUUID].temperature);
            chartData[record.deviceUUID].temperature.push({
                x: new Date(record.timestamp  * 1000),
                y: record.temperature
            });
            chartData[record.deviceUUID].humidity.push({
                x: new Date(record.timestamp  * 1000),
                y: record.humidity
            });
            chartData[record.deviceUUID].batteryv.push({
                x: new Date(record.timestamp * 1000),
                y: record.batteryv
            });
        });


        // create a chart for each deviceUUID
        //console.log(chartData);
        Object.keys(chartData).forEach(deviceUUID => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            canvas.id = deviceUUID;
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            chartConfig.data = {
                datasets: [{
                    label: 'Temperature',
                    data: chartData[deviceUUID].temperature,
                    borderColor: 'red',
                    fill: false
                }, {
                    label: 'Humidity',
                    data: chartData[deviceUUID].humidity,
                    borderColor: 'green',
                    fill: false
                }, {
                    label: 'Batteryv',
                    data: chartData[deviceUUID].batteryv,
                    borderColor: 'blue',
                    fill: false
                }]
            };
            //console.log(ctx)
            new Chart(ctx, chartConfig);
        });
    })
    .catch(error => {
        console.error(error);
         */




