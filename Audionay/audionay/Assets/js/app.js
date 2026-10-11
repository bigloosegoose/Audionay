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
const DIRECTIONS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

//dynamically adding handle elmnt
function addEdgeHandles(windowEl) {
  return DIRECTIONS.map((dir) => {
    const h = document.createElement("div");
    h.className = `edge edge-${dir}`;
    h.dataset.dir = dir;
    windowEl.appendChild(h);
    console.log(`made handle ${dir}`);
    return h;
  });
}

//get original
function pinPosition(box) {
  box.style.left = box.offsetLeft + "px";
  box.style.top = box.offsetTop + "px";
}

function smoveTo(box, el, x, y) {
  box.style.left = x - el.offsetLeft + "px";
  box.style.top = y - el.offsetTop + "px";
}

function workArea() {
  return {
    w: window.innerWidth,
    h: document.querySelector(".taskbar-container").getBoundingClientRect.top,
  };
}

function trackDrag() {
  e.preventDefault();
  e.stopPropagation();
  const startX = e.clientX;
  const startY = e.clientY;

  function move(ev) {
    onMove(ev.clientX - startX, ev.clientY - startY);
  }
  function stop() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stop);
  }
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stop);
}
addEdgeHandles(document.getElementById("player-window")); //temp

//player scale logic(not resize nono)
function makeScalable(
  box,
  windowEl,
  layoutEl,
  headerEl,
  bodyEl,
  minScale = 0.8,
  maxScale = 3,
) {
  const baseW = bodyEl.offsetWidth;
  const baseBodyH = bodyEl.offsetHeight;
  const headerH = headerEl.offsetHeight;
  const borderX = windowEl.offsetWidth - windowEl.clientWidth;
  const borderY = windowEl.offsetHeight - windowEl.clientHeight;

  bodyEl.style.width = baseW + "px";
  bodyEl.style.height = baseBodyH + "px";
  bodyEl.style.transformOrigin = "top left";

  let scale = 1;

  function setScale(s, force = false) {
    scale = force ? s : Math.min(Math.max(s, minScale), maxScale);
    bodyEl.style.transform = `scale(${scale})`;
    layoutEl.style.height = headerH + baseBodyH * scale + "px";
    windowEl.style.height = headerH + baseBodyH * scale + borderY + "px";
    windowEl.style.width = baseW * scale + borderX + "px";
    windowEl.style.height = headerH + baseBodyH * scale + borderY + "px";
  }

  function fitScale(availW, availH) {
    return Math.min(
      (availW - borderX) / baseW,
      (availH - borderY - borderY) / baseBodyH,
    );
  }
}

setScale(1);

addEdgeHandles(windowEl).forEach((handle) => {
  const dir = handle.dataset.dir;
  handle.addEventListener("mousedown", (e) => {
    pinPosition(box);
    const startScale = scale;
    const startW = windowEl.offsetWidth;
  });
});

//load wait

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
let currentSongIndex = -1;

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
    let x = Math.floor((songfile.duration % 60) / 1);
    let y = Math.floor((songfile.currentTime % 60) / 1);
    progressRange.value = (songfile.currentTime / songfile.duration) * 100;
    if (x < 10) {
      document.getElementById("duration").textContent =
        `${Math.floor(songfile.duration / 60)}:0${x}`;
    } else {
      document.getElementById("duration").textContent =
        `${Math.floor(songfile.duration / 60)}:${x}`;
    }
    if (y < 10) {
      document.getElementById("progress").textContent =
        `${Math.floor(songfile.currentTime / 60)}:0${y}`;
    } else {
      document.getElementById("progress").textContent =
        `${Math.floor(songfile.currentTime / 60)}:${y}`;
    }
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
  if (currentSongIndex > audios.length - 1) {
    currentSongIndex = currentSongIndex - 1;
  }
  const song = audios[currentSongIndex];
  songfile.src = `./Assets/audiofiles/${song.url}`;
  songfile.volume = volumeRange.value / 100;
  songfile.play();
  pause.style.display = "";
  play.style.display = "none";
  console.log(`next song (index:${currentSongIndex})`);

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});

previous.addEventListener("click", () => {
  songfile.pause();
  currentSongIndex = currentSongIndex - 1;
  if (currentSongIndex < 0) {
    currentSongIndex = currentSongIndex + 1;
  }
  const song = audios[currentSongIndex];
  songfile.src = `./Assets/audiofiles/${song.url}`;
  songfile.volume = volumeRange.value / 100;
  pause.style.display = "";
  play.style.display = "none";
  songfile.play();
  console.log(`previous song (index:${currentSongIndex})`);

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});
