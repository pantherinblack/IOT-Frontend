listDevices();

function listDevices() {
    fetch("http://80.208.228.90:8080/device/list", {
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
            console.log(data);

            const table = document.querySelector('.deviceTable');

// Create table headers
            const headers = ['Name', 'UUID', 'Latitude', 'Longitude'];
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

// Create table rows for each device
            data.forEach(device => {
                const tr = document.createElement('tr');

                // Add Name
                const nameTd = document.createElement('td');
                nameTd.textContent = device.deviceName;
                tr.appendChild(nameTd);

                // Add UUID
                const uuidTd = document.createElement('td');
                uuidTd.textContent = device.deviceUUID;
                tr.appendChild(uuidTd);

                // Add Latitude
                const latitudeTd = document.createElement('td');
                latitudeTd.textContent = device.latitude;
                tr.appendChild(latitudeTd);

                // Add Longitude
                const longitudeTd = document.createElement('td');
                longitudeTd.textContent = device.longitude;
                tr.appendChild(longitudeTd);

                // Add Edit button
                const editTd = document.createElement('td');
                const editBtn = document.createElement('button');
                editBtn.setAttribute('name', 'edit');
                editBtn.setAttribute('value', device.deviceUUID);
                editBtn.textContent = 'Edit';
                editBtn.addEventListener('click', () => {
                    // Add your code to handle editing here
                    window.location.href = `updatedevice.html?deviceName=${device.deviceName}&deviceUUID=${device.deviceUUID}&latitude=${device.latitude}&longitude=${device.longitude}`;

                });
                editTd.appendChild(editBtn);
                tr.appendChild(editTd);

                // Add Delete button
                const deleteTd = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('name', 'edit');
                deleteBtn.setAttribute('value', device.deviceUUID);
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => {
                    console.log(`Editing device with UUID ${device.deviceUUID}`);
                    // Add your code to handle editing here
                    fetch(`http://80.208.228.90:8080/device/delete/${device.deviceUUID}`, {
                        method: 'DELETE'
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log("Device deleted successfully");
                        window.location.href = "devices.html";
                    }).catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });

                });
                deleteTd.appendChild(deleteBtn);
                tr.appendChild(deleteTd);
                // Add row to table
                table.appendChild(tr);
            });

// Add table to the DOM
            document.body.appendChild(table);

            // Create Add button
            const addBtn = document.createElement('button');
            addBtn.textContent = 'Add Device';
            addBtn.addEventListener('click', () => {
                console.log('Adding new device');
                // Add your code to handle adding a new device here
                window.location.href = "insertdevice.html";
            });

// Add button after table
            table.parentNode.appendChild(addBtn);

        });
}