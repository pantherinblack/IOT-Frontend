const listRecordsButton = document.getElementById("listRecordsButton");
const recordTableBody = document.querySelector("#recordTable tbody");

listRecordsButton.addEventListener("click", function() {
    const url = "http://80.208.228.90:8080/record/list?time=60";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // clear the table body
            recordTableBody.innerHTML = "";

            // populate the table with the record data
            data.forEach(record => {
                const row = document.createElement("tr");
                const uuidCell = document.createElement("td");
                const deviceUuidCell = document.createElement("td");
                const timestampCell = document.createElement("td");
                const temperatureCell = document.createElement("td");
                const humidityCell = document.createElement("td");
                const batteryvCell = document.createElement("td");

                uuidCell.textContent = record.uuid;
                deviceUuidCell.textContent = record.deviceUUID;
                timestampCell.textContent = record.timestamp;
                temperatureCell.textContent = record.temperature;
                humidityCell.textContent = record.humidity;
                batteryvCell.textContent = record.batteryv;

                row.appendChild(uuidCell);
                row.appendChild(deviceUuidCell);
                row.appendChild(timestampCell);
                row.appendChild(temperatureCell);
                row.appendChild(humidityCell);
                row.appendChild(batteryvCell);

                recordTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error(error);
        });
});
