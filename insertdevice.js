document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("device-uuid").value = generateUUID();
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
    const form = document.querySelector('.insertDevice');
    const name = document.getElementById("device-name").value;
    const uuid = document.getElementById("device-uuid").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

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
            // handle successful response
        })
        .catch(error => {
            console.error(error);
        });
}


function generateUUID() {
    let uuid = '';
    const characters = '0123456789abcdef';

    for (let i = 0; i < 16; i++) {
        uuid += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    uuid = 'eui-' + uuid;
    return uuid;
}

