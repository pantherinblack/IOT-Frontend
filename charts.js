

const url = "http://80.208.228.90:8080/record/list?time=120";



fetch(url, {
    method: 'GET',
    headers: {        'Content-Type': 'application/json'    }
})
    .then(response => {
        if (!response.ok) {
            console.log(response);
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        const chartData = {};
        const chartOptions = {
            scales: {
                xAxes: [{
                    type: 'time',
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

        // group data by deviceUUID
        data.forEach(record => {
            if (!chartData[record.deviceUUID]) {
                chartData[record.deviceUUID] = {
                    temperature: [],
                    humidity: [],
                    batteryv: []
                };
            }
            chartData[record.deviceUUID].temperature.push({
                x: new Date(record.timestamp),
                y: record.temperature
            });
            chartData[record.deviceUUID].humidity.push({
                x: new Date(record.timestamp),
                y: record.humidity
            });
            chartData[record.deviceUUID].batteryv.push({
                x: new Date(record.timestamp),
                y: record.batteryv
            });
        });

        // create a chart for each deviceUUID
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
            console.log(ctx)
            new Chart(ctx, chartConfig);
        });
    })
    .catch(error => {
        console.error(error);
    });
