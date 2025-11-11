const YT_URL =
    "https://www.youtube.com/embed/oZAnZqp6LIU?si=5jE7xRpC4WKw12BE";

// elements
const pill = document.getElementById("musicPill");
const dock = document.getElementById("musicDock");
const dockBody = document.getElementById("dockBody");
const dockClose = document.getElementById("dockClose");

// helpers
function stopAndClear(container) {
    const iframe = container.querySelector("iframe");
    if (iframe) iframe.remove(); // removing the iframe stops playback
}

function createPlayer() {
    const iframe = document.createElement("iframe");
    iframe.src = YT_URL;
    iframe.title = "YouTube music player";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    dockBody.innerHTML = "";
    dockBody.appendChild(iframe);
}

function openDockAndPlay() {
    if (!dockBody.querySelector("iframe")) createPlayer(); // only create once
    dock.hidden = false;
    pill.setAttribute("aria-pressed", "true");
}

function stopAndHideDock() {
    stopAndClear(dockBody);
    dock.hidden = true;
    pill.setAttribute("aria-pressed", "false");
}

// events
pill?.addEventListener("click", () => {
    // if dock is hidden, open + play; otherwise just toggle visibility
    if (dock.hidden) {
        openDockAndPlay();
    } else {
        dock.hidden = true; // hide but keep playing state if iframe exists
    }
});

dockClose?.addEventListener("click", stopAndHideDock);

// allow esc to stop + hide
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dock.hidden) stopAndHideDock();
});
