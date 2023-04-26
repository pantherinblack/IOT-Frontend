const url = "http://80.208.228.90:8080/record/list?time=86400";

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

function updateChartData(updateurl) {
    fetch(updateurl, {
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

            var chart = Chart.getChart("myChart");
            chart.data.datasets[0].data = temperatures;
            chart.data.datasets[1].data = humidity;
            chart.data.datasets[2].data = batteryv;
            chart.data.labels = timestamps;
            chart.update();
        });
}




document.addEventListener("DOMContentLoaded", function() {
    // Get the buttons by their ID
    const lastDayBtn = document.getElementById("lastDayBtn");
    const lastWeekBtn = document.getElementById("lastWeekBtn");
    const lastMonthBtn = document.getElementById("lastMonthBtn");
    const lastYearBtn = document.getElementById("lastYearBtn");

    // Add event listeners to each button
    lastDayBtn.addEventListener("click", function() {
        // Handle click for "Last Day" button
        console.log("last Day");
        updateChartData("http://80.208.228.90:8080/record/list?time=86400");
    });

    lastWeekBtn.addEventListener("click", function() {
        // Handle click for "Last Week" button
        console.log("last Week");
        updateChartData("http://80.208.228.90:8080/record/list?time=604800");
    });

    lastMonthBtn.addEventListener("click", function() {
        // Handle click for "Last Month" button
        console.log("last Month");
        updateChartData("http://80.208.228.90:8080/record/list?time=2678400");
    });

    lastYearBtn.addEventListener("click", function() {
        // Handle click for "Last Year" button
        console.log("last Year");
        updateChartData("http://80.208.228.90:8080/record/list?time=31536000");
    });
});
