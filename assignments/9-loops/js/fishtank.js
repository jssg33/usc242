// Colors per tank
const bubbleColors = {
  1: { bg: 'rgba(255, 182, 193, 0.75)', glow: 'rgba(255, 105, 180, 0.9)' },
  2: { bg: 'rgba(144, 238, 144, 0.75)', glow: 'rgba(50, 205, 50, 0.85)' },
  3: { bg: 'rgba(173, 216, 230, 0.75)', glow: 'rgba(100, 149, 237, 0.9)' }
};

// Arrow function version
const addBubblesToTank = (tankElement, bubbleCount = 12) => {
  const tankNumber = tankElement.dataset.tank;
  const colors = bubbleColors[tankNumber] || { 
    bg: 'rgba(255,255,255,0.4)', 
    glow: 'rgba(255,255,255,0.5)' 
  };

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 20 + 8;      // 8–28px
    const left = 10 + Math.random() * 80;     // 10%–90%
    const duration = Math.random() * 8 + 7;   // 7–15s
    const delay = Math.random() * 5;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.bottom = '10px';
    bubble.style.background = colors.bg;
    bubble.style.boxShadow = `0 0 12px ${colors.glow}, inset 0 2px 6px rgba(255,255,255,0.4)`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    tankElement.appendChild(bubble);

    // Respawn one bubble when animation ends
    bubble.addEventListener('animationend', () => {
      bubble.remove();
      addBubblesToTank(tankElement, 1);
    });
  }
};

// DOMContentLoaded listener as arrow function
document.addEventListener('DOMContentLoaded', () => {
  const tanks = document.querySelectorAll('.tank-wrapper');
  tanks.forEach(tank => addBubblesToTank(tank, 12));
});

