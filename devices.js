// Author: Diego Fantino
// Version: 1.0
// Date: 2023-05-07

// This code adds an event listener for the 'DOMContentLoaded' event
// that calls the function 'listDevices' when the page loads
document.addEventListener("DOMContentLoaded", () => {
// Call the function 'listDevices' to retrieve device data and display it in a table
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
                const main = document.querySelector('main'); // select main element

                // Create table element
                const table = document.createElement('table');
                table.classList.add('deviceTable');

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
                        fetch(`https://80.208.228.90:8080/device/delete/${device.deviceUUID}`, {
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

                // Add table to the main element
                main.appendChild(table);

                // Create Add button
                const addBtn = document.createElement('button');
                addBtn.textContent = 'Add Device';
                addBtn.id = "addBtn";
                addBtn.addEventListener('click', () => {
                    console.log('Adding new device');
                    // Add your code to handle adding a new device here
                    window.location.href = "insertdevice.html";
                });

                // Add button after table
                main.appendChild(addBtn);

            }).finally(() => {
            generateFooter();
        });
    }
})

// Generates a footer
function generateFooter() {
    // Create a new "footer" element and assign it to the "footer" variable
    var footer = document.createElement('footer');

    // Set the innerHTML of the "footer" element to a template literal
    footer.innerHTML = `
        <div class="footer-content">
            <p>This website was developed for a project work</p>
        </div>
        <div class="footer-bottom">
            <p>copyright &copy; 2023 Diego Fantino, Kevin Stupar, Andras Tarlos.</p>
            <p> designed by Diego Fantino</p>
        </div>
    `;

    // Append the "footer" element to the document body
    document.body.appendChild(footer);
}