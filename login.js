$(document).ready(function () {
    $("#loginForm").submit(sendLogin);
});

function sendLogin(form) {
    form.preventDefault();
    $
        .ajax( {
            url: "https://80.208.228.90:8080/auth/login",
            type: "GET",
            data: $("#loginForm").serialize()
        })
        .done(function () {
        })
        .fail(function (xhr, status, errorThrown) {
            if (xhr.status === 403) {
                $("#message").text("Benutzername/Passwort unbekannt");
            } else {
                $("#message").text("Es ist ein Fehler aufgetreten");
            }

        })
}


