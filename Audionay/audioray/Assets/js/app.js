// my first js code!

const playlistBtn = document.getElementById("playlist-btn");
const playlistCloseBtn = document.getElementById("playlist-close-btn");
const playlist = document.getElementById("playlist");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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