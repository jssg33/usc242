  // =========================
// Shared Song Class
// =========================
class Song {
    constructor(title, artist, album, year, genre, cover, youtube) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.year = year;
        this.genre = genre;
        this.cover = cover;
        this.youtube = youtube;
    }

    getCard(index) {
        return `
            <div class="w3-card w3-white song-card" onclick="showSong(${index})">
                <img src="images/${this.cover}" class="song-cover">
                <div class="w3-container">
                    <p><b>${this.title}</b></p>
                    <p>${this.artist}</p>
                </div>
            </div>
        `;
    }
}

// =========================
// Shared Song List (Fallback)
// =========================
let songs = [
    new Song("Blinding Lights", "The Weeknd", "After Hours", 2020, "Synthwave", "blindinglights.jpg", "4NRXx6U8ABQ"),
    new Song("Viva La Vida", "Coldplay", "Viva La Vida", 2008, "Alternative Rock", "vivalavida.jpg", "dvgZkm1xWPE"),
    new Song("Bad Guy", "Billie Eilish", "When We All Fall Asleep", 2019, "Electropop", "badguy.jpg", "DyDfgMOUjCI"),
    new Song("Believer", "Imagine Dragons", "Evolve", 2017, "Rock", "believer.jpg", "7wtfhZwyrcc")
];

// =========================
// JSON Loader (Shared)
// =========================
async function loadJSON(callback) {
    try {
        const response = await fetch("hardrocksongs.json");
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        data.forEach(s => songs.push(new Song(
            s.title, s.artist, s.album, s.year, s.genre, s.cover, s.youtube
        )));

        console.log("Loaded JSON successfully.");
    } catch (error) {
        console.warn("Failed to load JSON, using fallback songs.", error);
    }

    callback(); // Run the page-specific gallery function
}

// =========================
// Home Page Gallery
// =========================
function loadHomeGallery() {
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    songs.forEach((song, index) => {
        gallery.innerHTML += song.getCard(index);
    });
}

// =========================
// Genre Page Gallery
// =========================
function loadGenreGallery() {
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    let genres = {};

    songs.forEach(song => {
        if (!genres[song.genre]) genres[song.genre] = [];
        genres[song.genre].push(song);
    });

    for (let genre in genres) {
        const safeId = genre.replace(/[^a-z0-9]/gi, "");

        gallery.innerHTML += `<div class="genre-title">${genre}</div>`;
        gallery.innerHTML += `<div class="genre-row" id="row-${safeId}"></div>`;

        let row = document.getElementById(`row-${safeId}`);

        genres[genre].forEach((song, index) => {
            row.innerHTML += song.getCard(index);
        });
    }
}

// =========================
// Modal Player (Shared)
// =========================
function showSong(index) {
    const s = songs[index];

    document.getElementById("modalTitle").innerText = s.title;
    document.getElementById("modalArtist").innerText = s.artist;
    document.getElementById("modalAlbum").innerText = s.album;
    document.getElementById("modalYear").innerText = s.year;
    document.getElementById("modalGenre").innerText = s.genre;
    document.getElementById("modalCover").src = "images/" + s.cover;
    document.getElementById("modalYoutube").src = "https://www.youtube.com/embed/" + s.youtube;

    document.getElementById("songModal").style.display = "block";
}
