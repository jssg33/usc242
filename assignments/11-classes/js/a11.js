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

            getCard() {
                return `
                    <div class="w3-card w3-white song-card">
                        <img src="images/${this.cover}" class="song-cover">
                        <div class="w3-container">
                            <p><b>${this.title}</b></p>
                            <p>${this.artist}</p>
                        </div>
                    </div>
                `;
            }
        }

        let songs = [];

        async function loadJSON() {
            const response = await fetch("hardrocksongs.json");
            const data = await response.json();

            data.forEach(s => songs.push(new Song(
                s.title, s.artist, s.album, s.year, s.genre, s.cover, s.youtube
            )));

            loadGallery();
        }

        function loadGallery() {
            let gallery = document.getElementById("gallery");
            gallery.innerHTML = "";

            let genres = {};

            songs.forEach(song => {
                if (!genres[song.genre]) genres[song.genre] = [];
                genres[song.genre].push(song);
            });

            for (let genre in genres) {
                gallery.innerHTML += `<div class="genre-title">${genre}</div>`;
                gallery.innerHTML += `<div class="genre-row" id="row-${genre.replace(/\s+/g,'')}"></div>`;

                let row = document.getElementById(`row-${genre.replace(/\s+/g,'')}`);

                genres[genre].forEach(song => {
                    row.innerHTML += song.getCard();
                });
            }
        }

        loadJSON();
