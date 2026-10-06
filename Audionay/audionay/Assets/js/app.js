// my first js code!

const playlistBtn = document.getElementById("playlist-btn");
const playlistCloseBtn = document.getElementById("playlist-close-btn");
const playlistMinimizeBtn = document.getElementById("playlist-minimize-btn");
const playlist = document.getElementById("playlist");

const desktopIcon = document.querySelector(".desktop-icon");
// const desktopIconImg = document.getElementById("desktop-icon-img");
const blueTint = document.getElementById("blue-tint");
const playerDetail = document.getElementById("bottom");
const playerWindow = document.getElementById("player-window");

const pause = document.getElementById("pause-btn");
const play = document.getElementById("play-btn");
const next = document.getElementById("next-btn");
const previous = document.getElementById("previous-btn");
const loop = document.getElementById("loop-btn");

const taskbarSecond = document.getElementById("taskbar-second");
const taskbarThird = document.getElementById("taskbar-third");

const Maximize = document.getElementById("Maximize");
const Minimize = document.getElementById("Minimize");
const Restore = document.getElementById("Restore");
const Exit = document.getElementById("Exit");

const songDuration = document.getElementById("duration");
const songprogress = document.getElementById("progress");

const volumeRange = document.getElementById("volrange");
const progressRange = document.getElementById("progressrange");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//initialize or something
blueTint.style.display = "none";
taskbarThird.style.display = "none";
playlist.style.display = "none";
pause.style.display = "none";

//making draggable
dragElement(document.getElementById("dragbox"));
dragElement(document.getElementById("dragbox2"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    console.log(elmnt.offsetTop - pos2 + "px", elmnt.offsetLeft - pos1 + "px");

    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//resize beta
function makeResizable(targetEl, handleEl, minW = 300, minH = 200) {
  handleEl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = targetEl.offsetWidth;
    const startH = targetEl.offsetHeight;

    function doResize(e) {
      targetEl.style.width =
        Math.max(startW + (e.clientX - startX), minW) + "px";
      targetEl.style.height =
        Math.max(startH + (e.clientY - startY), minH) + "px";
    }
    function stopResize() {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  });
}

makeResizable(
  document.getElementById("player-window"),
  document.getElementById("resize-player"),
);
makeResizable(
  document.getElementById("playlist"),
  document.getElementById("resize-playlist"),
);

//misc functions

async function playlistShow() {
  playlist.style.display = "";
}

async function playlistHide() {
  playlist.style.display = "none";
}

async function minimizeWindow() {
  playerWindow.style.display = "none";
  taskbarSecond.style.display = "none";
  playlist.style.display = "none";

  taskbarThird.style.display = "";
}

async function openWindow() {
  playerDetail.style.display = "";
  playerWindow.style.display = "";
  taskbarSecond.style.display = "";
  taskbarThird.style.display = "none";

  playerWindow.style.borderRight = "3px solid #0055E7";
  playerWindow.style.borderLeft = "3px solid #0055E7";
  playerWindow.style.borderBottom = "3px solid #0055E7";
}

function closeWindow() {
  playerWindow.style.display = "none";
  taskbarSecond.style.display = "none";
  taskbarThird.style.display = "none";
  playlist.style.display = "none";

  pause.style.display = "none";
  play.style.display = "";

  songfile.pause();
  songfile.currentTime = 0;
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  document.getElementById("clock").textContent = `${hours}:${minutes} ${ampm}`;
}

// PLAYLIST FUNCTIONS
const playlistItems = document.getElementById("playlist-items");
let currentSongIndex = 0;

function renderPlaylist() {
  playlistItems.innerHTML = "";

  audios.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "playlist-detail";
    item.dataset.index = index;

    item.innerHTML = `<div class="detailSongCover">
    <img src="./Assets/img/pfp.jpg" draggable="false" alt="song cover" class="cover">
    </div>
    <div class="detailSongInfo">
    <div class="detailSongTitle">${song.title}</div>
    <div class="detailSongArtist">${song.artist}</div>
    </div>
    `;

    item.addEventListener("click", () => {
      playSong(index);
    });

    playlistItems.appendChild(item);
  });
}

let songfile = new Audio();

function playSong(index) {
  currentSongIndex = index;
  const song = audios[index];

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;

  songfile.pause();
  songfile.src = `./Assets/audiofiles/${song.url}`;
  songfile.volume = volumeRange.value / 100;
  songfile.play();
  pause.style.display = "";
  play.style.display = "none";
  console.log("something should be playing");
}

renderPlaylist();

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
  if (desktopIcon.contains(e.target)) {
    desktopIcon.classList.add("selected");
    blueTint.style.display = "";
  } else {
    desktopIcon.classList.remove("selected");
    blueTint.style.display = "none";
  }
});

Exit.addEventListener("click", () => {
  closeWindow();

  document.getElementById("dragbox").style.top = "auto";
  document.getElementById("dragbox").style.left = "auto";
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

//range scrollers
volumeRange.addEventListener("input", function (event) {
  songfile.volume = event.target.value / 100;
});

songfile.addEventListener("timeupdate", () => {
  if (songfile.duration) {
    progressRange.value = (songfile.currentTime / songfile.duration) * 100;
  }
});

progressRange.addEventListener("input", function (event) {
  songfile.play();
  songfile.currentTime = (event.target.value / 100) * songfile.duration;
});

//player functions
let loopOn = false;
function toggleLoop() {
  if (loopOn) {
    loopOn = false;
    loop.style.filter = "";
    console.log("not looping");
  } else {
    loopOn = true;
    loop.style.filter = "invert()";
    console.log("looping");
  }
}

songfile.addEventListener("ended", () => {
  songfile.pause();
  if (loopOn) {
    songfile.play();
  }
});

loop.addEventListener("click", () => {
  toggleLoop();
});
pause.addEventListener("click", () => {
  songfile.pause();
  console.log("pause");
  pause.style.display = "none";
  play.style.display = "";
});
play.addEventListener("click", () => {
  songfile.play();
  console.log("play");
  pause.style.display = "";
  play.style.display = "none";
});
next.addEventListener("click", () => {
  songfile.pause();
  currentSongIndex = currentSongIndex + 1;
  const song = audios[currentSongIndex];
  songfile.src = `./Assets/audiofiles/${song.url}`;
  songfile.volume = volumeRange.value / 100;
  songfile.play();
  pause.style.display = "";
  play.style.display = "none";
  console.log("somethings");

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});

previous.addEventListener("click", () => {
  songfile.pause();
  currentSongIndex = currentSongIndex - 1;
  const song = audios[currentSongIndex];
  songfile.src = `./Assets/audiofiles/${song.url}`;
  songfile.volume = volumeRange.value / 100;
  pause.style.display = "";
  play.style.display = "none";
  songfile.play();
  console.log("somethings");

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});
