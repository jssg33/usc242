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

        // ⭐ SORT AFTER CONCATENATION ⭐
        songs.sort((a, b) => {
            const artistCompare = a.artist.localeCompare(b.artist);
            return artistCompare !== 0 ? artistCompare : a.album.localeCompare(b.album);
        });

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
    let container = document.getElementById("genreContainer");
    container.innerHTML = "";

    let genres = {};

    songs.forEach(song => {
        if (!genres[song.genre]) genres[song.genre] = [];
        genres[song.genre].push(song);
    });

    for (let genre in genres) {
        const safeId = genre.replace(/[^a-z0-9]/gi, "");

        container.innerHTML += `
            <div class="genre-row">
                <span class="genre-label">${genre}</span>
                <div class="genre-songs" id="genre-${safeId}"></div>
            </div>
        `;

        let row = document.getElementById(`genre-${safeId}`);

        genres[genre].forEach(song => {
            const globalIndex = songs.indexOf(song);
            row.innerHTML += song.getCard(globalIndex);
        });
    }
}

// ===============================
// Load Artists (Alphabetically)
// ===============================

function loadArtistsGallery() {
    fetch("artists.json")
        .then(response => response.json())
        .then(artists => {

            // Sort artists alphabetically by name
            artists.sort((a, b) => a.name.localeCompare(b.name));

            const container = document.getElementById("artistGallery");
            container.innerHTML = "";

            artists.forEach(artist => {
                const card = document.createElement("div");
                card.classList.add("artist-card");
                card.dataset.name = artist.name;

                card.innerHTML = `
                    <img src="${artist.image}" alt="${artist.name}">
                    <h3>${artist.name}</h3>
                `;

                // Use your existing albums function name
                card.addEventListener("click", () => {
                    loadArtistGallery(artist.id, artist.name);
                });

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading artists:", error));
}



// ===============================
// Load Albums for Selected Artist
// (Sorted Alphabetically)
// ===============================

function loadArtistGallery(artistId, artistName) {
    fetch("albums.json")
        .then(response => response.json())
        .then(albums => {

            // Filter albums for this artist
            let artistAlbums = albums.filter(album => album.artistId === artistId);

            // Sort albums alphabetically by title
            artistAlbums.sort((a, b) => a.title.localeCompare(b.title));

            const container = document.getElementById("albumGallery");
            container.innerHTML = "";

            document.getElementById("albumHeader").innerText = `${artistName} — Albums`;

            artistAlbums.forEach(album => {
                const card = document.createElement("div");
                card.classList.add("album-card");
                card.dataset.name = album.title;

                card.innerHTML = `
                    <img src="${album.cover}" alt="${album.title}">
                    <h3>${album.title}</h3>
                `;

                card.addEventListener("click", () => {
                    loadAlbumSongs(album.id, album.title);
                });

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading albums:", error));
}

function loadAlbumGallery(artistId, artistName) {
    fetch("albums.json")
        .then(response => response.json())
        .then(albums => {

            // Filter albums for this artist
            let artistAlbums = albums.filter(album => album.artistId === artistId);

            // ⭐ SORT ALPHABETICALLY BY ALBUM NAME ⭐
            artistAlbums.sort((a, b) => a.title.localeCompare(b.title));

            const container = document.getElementById("albumGallery");
            container.innerHTML = "";

            document.getElementById("albumHeader").innerText = `${artistName} — Albums`;

            artistAlbums.forEach(album => {
                const card = document.createElement("div");
                card.classList.add("album-card");
                card.dataset.name = album.title;

                card.innerHTML = `
                    <img src="${album.cover}" alt="${album.title}">
                    <h3>${album.title}</h3>
                `;

                card.addEventListener("click", () => {
                    loadAlbumSongs(album.id, album.title);
                });

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading albums:", error));
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

// =========================
// Close Modal
// =========================
function closeModal() {
    document.getElementById("songModal").style.display = "none";
    document.getElementById("modalYoutube").src = "";
}
