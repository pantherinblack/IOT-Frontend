$(document).ready(function () {
    $("#loginForm").submit(sendLogin);
    $("#logoff").click(sendLogoff);
});

function sendLogin(form) {
    form.preventDefault();
    $
        .ajax( {
            url: "http://80.208.228.90:8080/auth/login",
            dataType: "text",
            type: "GET",
            data: $("#loginForm").serialize()
        })
        .done(function () {
            window.location.href = "index.html";
        })
        .fail(function (xhr, status, errorThrown) {
            if (xhr.status == 404) {
                $("#message").text("Benutzername/Passwort unbekannt");
            } else {
                $("#message").text("Es ist ein Fehler aufgetreten");
            }

        })
}

function sendLogoff() {
    $
        .ajax( {
            url: "http://80.208.228.90:8080/auth/logoff",
            dataType: "text",
            type: "DELETE",
        })
        .done(function () {
            window.location.href = "analytics.html";
        })
        .fail(function (xhr, status, errorThrown) {
        })
}


