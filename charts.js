const url = "http://80.208.228.90:8080/record/list?time=86400";

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
        const chartData = {};

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

        // sort the arrays by timestamps in ascending order
        var sortedIndex = timestamps.map((value, index) => [value, index])
            .sort(([a], [b]) => a - b)
            .map(([_, index]) => index);

        timestamps = sortedIndex.map(index => timestamps[index]);
        temperatures = sortedIndex.map(index => temperatures[index]);
        humidity = sortedIndex.map(index => humidity[index]);
        batteryv = sortedIndex.map(index => batteryv[index]);

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
                            labelString: 'Temperature, Humidity, Battery Voltage'
                        }
                    }]
                }
            }
        });
    });
