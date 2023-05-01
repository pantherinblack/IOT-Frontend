document.addEventListener("DOMContentLoaded", () => {
    console.log("started");
// Extract the URL parameters and set the values of the form fields
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('deviceName');
    const uuid = urlParams.get('deviceUUID');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');

    document.getElementById("device-name").value = name;
    document.getElementById("device-uuid").value = uuid;
    document.getElementById("latitude").value = latitude;
    document.getElementById("longitude").value = longitude;

    const myButton = document.getElementById("submit");
    myButton.addEventListener("click", function() {
        // Code to be executed when the button is clicked
        submit();
    });

    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", function() {
        // Code to execute when the button is clicked
        window.location.href = "devices.html";
    });
})


function submit() {
    console.log("Diegpo");

    const form = document.querySelector('.updateDevice');

    const name = document.getElementById("device-name").value;
    const uuid = document.getElementById("device-uuid").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    form.reset();
}
