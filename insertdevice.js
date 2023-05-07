// Author: Diego Fantino
// Version: 1.0
// Date: 2023-05-07

// Add event listener for when the page has finished loading
document.addEventListener("DOMContentLoaded", () => {

    // Generate a UUID and set it as the value of the device-uuid field
    document.getElementById("device-uuid").value = generateUUID();

    // Add event listener to the submit button
    const myButton = document.getElementById("submit");
    myButton.addEventListener("click", function() {
        // Code to be executed when the button is clicked
        submit();
    });

    // Add event listener to the cancel button
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", function() {
        // Code to execute when the button is clicked
        window.location.href = "devices.html";
    });

    // Generate and append the footer to the page
    generateFooter();

})

// Function to handle the form submission
function submit() {
    // Get the form and the input values
    const form = document.querySelector('.insertDevice');
    const name = document.getElementById("device-name").value;
    const uuid = document.getElementById("device-uuid").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    // Send a POST request to the server with the input values
    fetch('http://80.208.228.90:8080/device/insert', {
        method: 'POST',
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
        .then(() => {
            // Handle successful response
        })
        .catch(error => {
            // Handle error
            console.error(error);
        });
}

// Function to generate a random UUID
function generateUUID() {
    let uuid = '';
    const characters = '0123456789abcdef';

    for (let i = 0; i < 16; i++) {
        uuid += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    uuid = 'eui-' + uuid;
    return uuid;
}

// Function to generate and append the footer to the page
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