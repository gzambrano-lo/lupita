(function () {
    const page = document.body;
    const pageAudio = document.getElementById("pageAudio");

    if (!page || !page.classList.contains("post-page-2026-06-02") || !pageAudio) {
        return;
    }

    function syncRedAlert() {
        page.classList.toggle("is-red-alert", !pageAudio.paused && !pageAudio.ended);
    }

    ["play", "playing", "pause", "ended", "emptied"].forEach(function (eventName) {
        pageAudio.addEventListener(eventName, syncRedAlert);
    });

    window.addEventListener("pagehide", function () {
        page.classList.remove("is-red-alert");
    });

    syncRedAlert();
})();
