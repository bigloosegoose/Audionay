// my first js code!

const playlistBtn = document.getElementById("playlist-btn");
const playlistCloseBtn = document.getElementById("playlist-close-btn");
const playlist = document.getElementById("playlist");

const desktopIcon = document.querySelector(".desktop-icon")
// const desktopIconImg = document.getElementById("desktop-icon-img");
const blueTint = document.getElementById("blue-tint");
const playerWindow = document.getElementById("player-window");

const Maximize = document.getElementById("Maximize");
const Minimize = document.getElementById("Minimize");
const Restore = document.getElementById("Restore");
const Exit = document.getElementById("Exit");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//initialize or something
blueTint.style.display = "none";

async function playlistShow() {
    playlist.style.top = "105%"; 
    await sleep(100);
    playlist.style.zIndex = "1";
    await sleep(100);
    playlist.style.top = "0%";
}

async function playlistHide() {
    playlist.style.top = "105%"; 
    await sleep(100);
    playlist.style.zIndex = "-1";
    await sleep(100);
    playlist.style.top = "0%";
}

playlistBtn.addEventListener("click", () => {
    playlistShow();
});

playlistCloseBtn.addEventListener("click", () => {
    playlistHide();
});


document.body.addEventListener("mousedown", (e) => {
    if (desktopIcon.contains(e.target)){
        desktopIcon.classList.add("selected");
        blueTint.style.display = "";
    }
    else{
        desktopIcon.classList.remove("selected");
        blueTint.style.display = "none";
    }
});

Exit.addEventListener("click", () => {
    playerWindow.style.display = "none";
});

blueTint.addEventListener("dblclick", () => {
    playerWindow.style.display = ""
});

