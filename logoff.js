document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("logoff");
    link.addEventListener("click", function (event) {
        event.preventDefault(); // prevent the link from navigating to the href
        // your code here
        sendLogoff();
    });
});

function sendLogoff() {
    $
        .ajax( {
            url: "https://80.208.228.90:8080/auth/logout",
            type: "DELETE",
        })
        .done(function () {
            window.location.href = "index.html";
        })
}