// ------------------------------
// Mood Song Lists (Associative Arrays)
// ------------------------------

const happy = {
    "Happy – Pharrell Williams": "https://www.youtube.com/embed/ZbZSe6N_BXs",
    "Good Vibrations – The Beach Boys": "https://www.youtube.com/embed/Eab_beh07HU",
    "Walking on Sunshine – Katrina & The Waves": "https://www.youtube.com/embed/iPUmE-tne5U",
    "Can't Stop the Feeling – Justin Timberlake": "https://www.youtube.com/embed/ru0K8uYEZWw",
    "Best Day of My Life – American Authors": "https://www.youtube.com/embed/Y66j_BUCBMY"
};

const sad = {
    "Someone Like You – Adele": "https://www.youtube.com/embed/hLQl3WQQoQ0",
    "Fix You – Coldplay": "https://www.youtube.com/embed/k4V3Mo61fJM",
    "Let Her Go – Passenger": "https://www.youtube.com/embed/RBumgq5yVrA",
    "Say Something – A Great Big World": "https://www.youtube.com/embed/-2U0Ivkn2Ds",
    "Everybody Hurts – R.E.M.": "https://www.youtube.com/embed/5rOiW_xY-kc"
};

// ------------------------------
// Handle Dropdown Selection (Arrow Function)
// ------------------------------

const showSongsFromDropdown = () => {
    const dropdown = document.getElementById("mood-dropdown");
    const selectedMood = dropdown.value;

    const songListDiv = document.getElementById("song-list");
    const moodTitle = document.getElementById("mood-title");
    const videoContainer = document.getElementById("video-container");

    // Reset display
    songListDiv.innerHTML = "";
    songListDiv.style.display = "none";
    videoContainer.style.display = "none";
    moodTitle.textContent = "";

    if (selectedMood === "") return;

    // Pick correct array
    const songs = selectedMood === "happy" ? happy : sad;

    // Set title
    moodTitle.textContent = selectedMood === "happy" ? "Happy Songs" : "Sad Songs";

    // Build song list
    Object.keys(songs).forEach(song => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = song;
        link.style.color = "#ffffff";
        link.onclick = () => loadVideo(songs[song]);
        songListDiv.appendChild(link);
    });

    // Show the list
    songListDiv.style.display = "block";
};

// ------------------------------
// Load Video into Iframe (Arrow Function)
// ------------------------------

const loadVideo = (url) => {
    const frame = document.getElementById("video-frame");
    const videoContainer = document.getElementById("video-container");

    frame.src = url;
    videoContainer.style.display = "block";
};
