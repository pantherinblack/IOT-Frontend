// Author: Diego Fantino
// Version: 1.0
// Date: 2023-05-07

// This sets up an event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // This gets the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    // These variables get the values of the query parameters
    const name = urlParams.get('deviceName');
    const uuid = urlParams.get('deviceUUID');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');

    // These lines populate the input fields with the values of the query parameters
    document.getElementById("device-name").value = name;
    document.getElementById("device-uuid").value = uuid;
    document.getElementById("latitude").value = latitude;
    document.getElementById("longitude").value = longitude;

    // This sets up an event listener for when the "submit" button is clicked
    const myButton = document.getElementById("submit");
    myButton.addEventListener("click", function() {
        submit();
    });

    // This sets up an event listener for when the "cancel" button is clicked
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", function() {
        window.location.href = "devices.html";
    });

    // This generates and appends the page footer
    generateFooter();
});

// This function sends an update request to the server
function submit() {
    // This gets the form element
    const form = document.querySelector('.updateDevice');

    // These lines get the values of the input fields
    const name = document.getElementById("device-name").value;
    const uuid = document.getElementById("device-uuid").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    // This sends a PUT request to the specified URL with the updated device information
    fetch('http://80.208.228.90:8080/device/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "deviceUUID": uuid,
            "deviceName": name,
            "longitude": latitude,
            "latitude": longitude
        })
    })
        // This function is called if the fetch request succeeds
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // do something with the response data, if needed
        })
        // This function is called if there is an error with the fetch request
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // This resets the form input fields
    form.reset();
}

// This function generates and appends the page footer
function generateFooter() {
    var footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-content">
            <p>This website was developed for a project work</p>
        </div>
        <div class="footer-bottom">
            <p>copyright &copy; 2023 Diego Fantino, Kevin Stupar, Andras Tarlos.</p>
            <p> designed by Diego Fantino</p>
        </div>
    `;
    document.body.appendChild(footer);
}