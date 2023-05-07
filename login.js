// Author: Diego Fantino, Marcel Suter (This code was created in a school assignment of module 153)
// Version: 1.0
// Date: 2023-05-07

// This sets up an event listener for when the document is fully loaded
$(document).ready(function () {
    // This sets up an event listener for when the login form is submitted
    $("#loginForm").submit(sendLogin);
});

// This is the callback function that is called when the login form is submitted
function sendLogin(form) {
    // This prevents the default form submission behavior (reloading the page)
    form.preventDefault();
    // This sends an AJAX GET request to the specified URL with the form data serialized
    $.ajax( {
        url: "http://80.208.228.90:8080/auth/login",
        type: "GET",
        data: $("#loginForm").serialize()
    })
        // This function is called if the AJAX request succeeds
        .done(function () {
            // This redirects the user to the index.html page
            window.location.href = "index.html";
        })
        // This function is called if the AJAX request fails
        .fail(function (xhr, status, errorThrown) {
            // This checks the status code of the response
            if (xhr.status != 200) {
                // This sets the message text to "Benutzername/Passwort unbekannt"
                $("#message").text("Benutzername/Passwort unbekannt");
            } else {
                // This sets the message text to "Es ist ein Fehler aufgetreten"
                $("#message").text("Es ist ein Fehler aufgetreten");
            }
        })
}