// my first js code!

const playlistBtn = document.getElementById("playlist-btn");
const playlistCloseBtn = document.getElementById("playlist-close-btn");
const playlist = document.getElementById("playlist");

const desktopIcon = document.querySelector(".desktop-icon")
// const desktopIconImg = document.getElementById("desktop-icon-img");
const blueTint = document.getElementById("blue-tint");
const playerWindow = document.getElementById("player-window");

const taskbarSecond = document.getElementById("taskbar-second");
const taskbarThird = document.getElementById("taskbar-third");

const Maximize = document.getElementById("Maximize");
const Minimize = document.getElementById("Minimize");
const Restore = document.getElementById("Restore");
const Exit = document.getElementById("Exit");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//initialize or something
blueTint.style.display = "none";
taskbarThird.style.display = "none";

//functions

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

function minimizeWindow() {
    playerWindow.style.display = "none";

    taskbarSecond.style.display = "none";
    taskbarThird.style.display = "";
}

function openWindow() {
    playerWindow.style.display = ""
    taskbarSecond.style.display = "";
    taskbarThird.style.display = "none";
}

function closeWindow(){
    playerWindow.style.display = "none";
    taskbarSecond.style.display = "none";
    taskbarThird.style.display = "none";
}

function updateClock(){
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    document.getElementById("clock").textContent = `${hours}:${minutes} ${ampm}`;
}


updateClock();
setInterval(updateClock, 1000);

//player app buttons

playlistBtn.addEventListener("click", () => {
    playlistShow();
});

playlistCloseBtn.addEventListener("click", () => {
    playlistHide();
});

//desktop

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
    closeWindow();
});

Minimize.addEventListener("click", () => {
    minimizeWindow();
});

blueTint.addEventListener("dblclick", () => {
    openWindow();
    desktopIcon.classList.remove("selected");
    blueTint.style.display = "none";
});

//taskbar buttons
taskbarSecond.addEventListener("click", () => {
    minimizeWindow();
});

taskbarThird.addEventListener("click", () => {
    openWindow();
});
//hover
taskbarSecond.addEventListener("mouseover", () => {
    taskbarSecond.src = "./Assets/img/secondHover.png";
});
taskbarSecond.addEventListener("mouseout", () => {
    taskbarSecond.src = "./Assets/img/secondmini.png";
});

taskbarThird.addEventListener("mouseover", () => {
    taskbarThird.src = "./Assets/img/thirdHover.png";
});
taskbarThird.addEventListener("mouseout", () => {
    taskbarThird.src = "./Assets/img/thirdmini.png";
});