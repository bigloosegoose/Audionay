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
const autoButton = document.getElementById("auto-btn");
let auto = false;

const volumeRange = document.getElementById("volrange");
const progressRange = document.getElementById("progressrange");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let songfile = new Audio();

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
    if (elmnt.classList.contains("maximized")) {
      return;
    }
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
    return h;
  });
}

//get original
function pinPosition(box) {
  box.style.left = box.offsetLeft + "px";
  box.style.top = box.offsetTop + "px";
}

function moveTo(box, el, x, y) {
  box.style.left = x - el.offsetLeft + "px";
  box.style.top = y - el.offsetTop + "px";
}

function workArea() {
  return {
    w: window.innerWidth,
    h: document.querySelector(".taskbar-container").getBoundingClientRect().top,
  };
}

function trackDrag(e, onMove) {
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

//player scale logic(not resize nono)
function makeScalable(
  box,
  windowEl,
  layoutEl,
  headerEl,
  bodyEl,
  minScale = 0.8,
) {
  const baseW = bodyEl.offsetWidth;
  const baseBodyH = bodyEl.offsetHeight;
  const headerH = headerEl.offsetHeight;
  const borderX = windowEl.offsetWidth - windowEl.clientWidth;
  const borderY = windowEl.offsetHeight - windowEl.clientHeight;

  const minW = baseW * minScale + borderX;
  const minH = headerH + baseBodyH * minScale + borderY;

  bodyEl.style.width = baseW + "px";
  bodyEl.style.height = baseBodyH + "px";
  bodyEl.style.transformOrigin = "top left";

  // sets the window's outer size; the body scales to fit and is centered in the leftover space
  function setSize(w, h) {
    w = Math.max(w, minW);
    h = Math.max(h, minH);

    const availW = w - borderX;
    const availH = h - headerH - borderY;
    const scale = Math.min(availW / baseW, availH / baseBodyH);
    const offX = (availW - baseW * scale) / 2;
    const offY = (availH - baseBodyH * scale) / 2;

    windowEl.style.width = w + "px";
    windowEl.style.height = h + "px";
    layoutEl.style.height = h - borderY + "px";
    bodyEl.style.transform = `translate(${offX}px, ${offY}px) scale(${scale})`;

    return { w, h }; // the clamped size
  }

  setSize(baseW + borderX, headerH + baseBodyH + borderY);

  addEdgeHandles(windowEl).forEach((handle) => {
    const dir = handle.dataset.dir;
    handle.addEventListener("mousedown", (e) => {
      pinPosition(box);
      const startW = windowEl.offsetWidth;
      const startH = windowEl.offsetHeight;
      const startLeft = box.offsetLeft;
      const startTop = box.offsetTop;

      trackDrag(e, (dx, dy) => {
        let w = startW;
        let h = startH;
        if (dir.includes("e")) w = startW + dx;
        if (dir.includes("w")) w = startW - dx;
        if (dir.includes("s")) h = startH + dy;
        if (dir.includes("n")) h = startH - dy;

        const size = setSize(w, h);

        // keep the opposite edge anchored (uses the clamped size, not a DOM read)
        if (dir.includes("w"))
          box.style.left = startLeft + (startW - size.w) + "px";
        if (dir.includes("n"))
          box.style.top = startTop + (startH - size.h) + "px";
      });
    });
  });

  return { setSize };
}
//yes playlist logic now
function makeResizable(box, windowEl, minW = 300, minH = 200) {
  addEdgeHandles(windowEl).forEach((handle) => {
    const dir = handle.dataset.dir;
    handle.addEventListener("mousedown", (e) => {
      pinPosition(box);
      const startW = windowEl.offsetWidth;
      const startH = windowEl.offsetHeight;
      const startLeft = box.offsetLeft;
      const startTop = box.offsetTop;
      trackDrag(e, (dx, dy) => {
        let w = startW;
        let h = startH;
        if (dir.includes("e")) w = startW + dx;
        if (dir.includes("w")) w = startW - dx;
        if (dir.includes("s")) h = startH + dy;
        if (dir.includes("n")) h = startH - dy;
        w = Math.max(w, minW);
        h = Math.max(h, minH);

        windowEl.style.width = w + "px";
        windowEl.style.height = h + "px";
        if (dir.includes("w")) box.style.left = startLeft + (startW - w) + "px";
        if (dir.includes("n")) box.style.top = startTop + (startH - h) + "px";
      });
    });
  });
}
const playerBox = document.getElementById("dragbox");
const playlistBox = document.getElementById("dragbox2");
let playerScale;

window.addEventListener("load", () => {
  playerScale = makeScalable(
    playerBox,
    playerWindow,
    document.querySelector("#player-window .main-layout"),
    document.querySelector("#player-window .playerHeader"),
    document.getElementById("bottom"),
  );
  makeResizable(playlistBox, playlist);
});

let playerPrev = null;

Maximize.addEventListener("click", () => {
  const area = workArea();
  playerPrev = {
    w: playerWindow.offsetWidth,
    h: playerWindow.offsetHeight,
    left: playerBox.offsetLeft,
    top: playerBox.offsetTop,
  };

  playerBox.classList.add("maximized");
  playerScale.setSize(area.w, area.h);
  moveTo(playerBox, playerWindow, 0, 0);

  Maximize.style.display = "none";
  Restore.style.display = "block";
});

Restore.addEventListener("click", () => {
  playerScale.setSize(playerPrev.w, playerPrev.h);
  playerBox.style.left = playerPrev.left + "px";
  playerBox.style.top = playerPrev.top + "px";
  playerBox.classList.remove("maximized");

  Restore.style.display = "none";
  Maximize.style.display = "block";
});
const playlistMax = document.getElementById("Playlist-Maximize");
const playlistRestore = document.getElementById("Playlist-Restore");
let playlistPrev = null;

playlistMax.addEventListener("click", () => {
  const area = workArea();
  playlistPrev = {
    width: playlist.style.width,
    height: playlist.style.height,
    left: playlistBox.offsetLeft,
    top: playlistBox.offsetTop,
  };

  playlistBox.classList.add("maximized");
  playlist.style.width = area.w + "px";
  playlist.style.height = area.h + "px";
  moveTo(playlistBox, playlist, 0, 0);

  playlistMax.style.display = "none";
  playlistRestore.style.display = "block";
});

playlistRestore.addEventListener("click", () => {
  playlist.style.width = playlistPrev.width;
  playlist.style.height = playlistPrev.height;
  playlistBox.style.left = playlistPrev.left + "px";
  playlistBox.style.top = playlistPrev.top + "px";
  playlistBox.classList.remove("maximized");

  playlistRestore.style.display = "none";
  playlistMax.style.display = "block";
});

//misc functions
autoButton.addEventListener("click", () => {
  if (auto) {
    auto = false;
    autoButton.style.filter = "none";
    console.log("auto off");
  } else {
    auto = true;
    if (loopOn) toggleLoop();
    autoButton.style.filter = "invert()";
    console.log("auto on");
  }
});

let playing = false;
function togglePlay() {
  if (songfile) {
    if (playing == false) {
      songfile.play();
      pause.style.display = "";
      play.style.display = "none";
      playing = true;
    } else {
      if (playing) {
        songfile.pause();
        pause.style.display = "none";
        play.style.display = "";
        playing = false;
      }
    }
  }
}

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
  if (playerBox.classList.contains("maximized")) {
    Restore.click();
  }
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

function playSong(index) {
  currentSongIndex = index;
  const song = audios[index];

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
  songfile.pause();
  songfile.src = songSrc(song);
  songfile.volume = volumeRange.value / 100;
  playing = false;
  togglePlay();

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
  songfile.currentTime = (event.target.value / 100) * songfile.duration;
});
//song add funcs
function songSrc(song) {
  return song.src || `./Assets/audiofiles/${song.url}`;
}

const dbPromise = new Promise((resolve, reject) => {
  const req = indexedDB.open("audionay", 1);
  req.onupgradeneeded = () =>
    req.result.createObjectStore("songs", { keyPath: "id" });
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

async function dbSave(record) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction("songs", "readwrite");
    tx.objectStore("songs").put(record);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function dbLoadAll() {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const req = db.transaction("songs").objectStore("songs").getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadSavedSongs() {
  const saved = await dbLoadAll();
  saved.forEach((rec) => {
    audios.push({
      id: rec.id,
      title: rec.title,
      artist: rec.artist,
      src: URL.createObjectURL(rec.file),
      thumbnail: "",
    });
  });
  renderPlaylist();
}
loadSavedSongs();

const songInput = document.getElementById("song-input");
const addSongsBtn = document.getElementById("add-song-btn");

addSongsBtn.addEventListener("click", () => songInput.click());

songInput.addEventListener("change", async () => {
  for (const file of songInput.files) {
    const name = file.name.replace(/\.[^/.]+$/, ""); // strip the extension
    const [artist, title] = name.includes(" - ")
      ? name.split(" - ")
      : ["Unknown artist", name];
    const id = crypto.randomUUID();

    audios.push({
      id,
      title,
      artist,
      src: URL.createObjectURL(file),
      thumbnail: "",
    });
    await dbSave({ id, title, artist, file });
  }
  songInput.value = "";
  renderPlaylist();
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
    auto = false;
    autoButton.style.filter = "none";
  }
}

songfile.addEventListener("ended", () => {
  songfile.pause();
  if (loopOn) {
    songfile.play();
  }
  if (auto) {
    playing = true;
    togglePlay();
    currentSongIndex = currentSongIndex + 1;
    if (currentSongIndex > audios.length - 1) {
      currentSongIndex = currentSongIndex - 1;
    }
    const song = audios[currentSongIndex];
    songfile.src = songSrc(song);
    songfile.volume = volumeRange.value / 100;
    togglePlay();
    console.log(`next song (index:${currentSongIndex})`);

    document.querySelector(".playerDetail .detailSongTitle").textContent =
      song.title;
    document.querySelector(".playerDetail .detailSongArtist").textContent =
      song.artist;
  }
});

loop.addEventListener("click", () => {
  toggleLoop();
});
pause.addEventListener("click", () => {
  togglePlay();
});
play.addEventListener("click", () => {
  console.log("play");
  togglePlay();
});
next.addEventListener("click", () => {
  playing = true;
  togglePlay();
  currentSongIndex = currentSongIndex + 1;
  if (currentSongIndex > audios.length - 1) {
    currentSongIndex = currentSongIndex - 1;
  }
  const song = audios[currentSongIndex];
  songfile.src = songSrc(song);
  songfile.volume = volumeRange.value / 100;
  togglePlay();
  console.log(`next song (index:${currentSongIndex})`);

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});

previous.addEventListener("click", () => {
  playing = true;
  togglePlay();
  currentSongIndex = currentSongIndex - 1;
  if (currentSongIndex < 0) {
    currentSongIndex = currentSongIndex + 1;
  }
  const song = audios[currentSongIndex];
  songfile.src = songSrc(song);
  songfile.volume = volumeRange.value / 100;
  togglePlay();
  console.log(`previous song (index:${currentSongIndex})`);

  document.querySelector(".playerDetail .detailSongTitle").textContent =
    song.title;
  document.querySelector(".playerDetail .detailSongArtist").textContent =
    song.artist;
});
