// Author: Diego Fantino, Marcel Suter (This code was created in a school assignment of module 153)
// Version: 1.0
// Date: 2023-05-07

// This sets up an event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // This gets the logoff link element
    const link = document.getElementById("logoff");
    // This sets up an event listener for when the logoff link is clicked
    link.addEventListener("click", function (event) {
        // This prevents the default link behavior (navigating to the href)
        event.preventDefault();
        // This calls the sendLogoff function
        sendLogoff();
    });
});

// This function sends a logoff request to the server
function sendLogoff() {
    // This sends an AJAX DELETE request to the specified URL
    $.ajax( {
        url: "http://80.208.228.90:8080/auth/logout",
        type: "DELETE",
    })
        // This function is called if the AJAX request succeeds
        .done(function () {
            // This redirects the user to the index.html page
            window.location.href = "index.html";
        })
}