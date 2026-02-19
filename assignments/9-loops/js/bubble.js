// === Bubble Creator ===
function createBubbles(count = 30) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    // Random properties
    const size = Math.random() * 60 + 20;           // 20–80px
    const left = Math.random() * 100;               // 0–100vw
    const duration = Math.random() * 12 + 8;        // 8–20 seconds
    const delay = Math.random() * 10;               // 0–10s delay

    // Apply styles
    Object.assign(bubble.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}vw`,
      bottom: `-${size}px`,           // start below screen
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    });

    document.body.appendChild(bubble);

    // Optional: remove bubble after animation finishes to prevent DOM bloat
    bubble.addEventListener("animationend", () => {
      bubble.remove();
    });
  }
}

// Create bubbles when page loads
createBubbles(40);

// Optional: keep creating new bubbles forever
setInterval(() => {
  createBubbles(3); // gentle continuous stream
}, 4000);
