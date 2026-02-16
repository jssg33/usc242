/* ---------------- MOBILE MENU ---------------- */
const mobileMenu = document.getElementById("mobilemenu");
const hidingList = document.getElementById("hiding");

mobileMenu.addEventListener("click", function () {
  if (window.innerWidth < 1000) {
    const isOpen = hidingList.style.display === "block";

    hidingList.style.display = isOpen ? "none" : "block";

    // Rotate arrow
    mobileMenu.classList.toggle("open", !isOpen);
  }
});

/* ---------------- EXERCISE 2 ---------------- */
function getExercise2Message() {
  const now = new Date();

  // Today’s class time: 8:30 AM
  const classTime = new Date();
  classTime.setHours(8, 30, 0, 0);

  // Minutes difference (can be negative)
  const diffMs = classTime - now;
  const diffMinutes = Math.floor(diffMs / 60000);

  return getMessageForRange(diffMinutes);
}

function getMessageForRange(minutes) {
  // Class is in the future
  if (minutes > 15) {
    return "Plenty of time — maybe grab a smoothie and chill 😎";
  }
  if (minutes > 10) {
    return "You’re doing great — still a comfy buffer ⏳";
  }
  if (minutes > 5) {
    return "Starting to get close — better get moving 🚶‍♂️💨";
  }
  if (minutes >= 0) {
    return "Class is about to start — hustle mode activated 🏃‍♀️🔥";
  }

  // Class already started
  const late = Math.abs(minutes);

  if (late <= 5) {
    return "Class just started — slip in quietly 😬";
  }
  if (late <= 15) {
    return "You're a bit late — but still worth showing up 📘";
  }

  return "Class started a while ago… maybe review the notes later 🤷‍♂️";
}

/* ---------------- EXERCISE 1 ---------------- */
function ex1() {
  document.getElementById("conditionalquestion").innerHTML =
    "How many minutes until class?";

  const minutes = getMinutesUntilNextClass();
  const text = getClassCountdownMessage(minutes);

  const slider = document.getElementById("timeSlider");
  const message = document.getElementById("message");

  message.textContent = text;

  slider.oninput = function () {
    message.textContent = getClassCountdownMessage(Number(this.value));
  };
}

/* ---------------- EXERCISE 2 ---------------- */
function ex2() {
  document.getElementById("conditionalquestion").innerHTML =
    "Countdown to class";

  const message = getExercise2Message();
  document.getElementById("message").textContent = message;
}

/* ---------------- TIME CALCULATION ---------------- */
function getMinutesUntilNextClass() {
  const now = new Date();

  const classDays = [2, 4]; // Tue = 2, Thu = 4
  const classHour = 8;
  const classMinute = 30;

  let nextClass = new Date(now);

  while (!classDays.includes(nextClass.getDay())) {
    nextClass.setDate(nextClass.getDate() + 1);
  }

  nextClass.setHours(classHour, classMinute, 0, 0);

  if (nextClass <= now) {
    nextClass.setDate(nextClass.getDate() + 2);
  }

  const diffMs = nextClass - now;
  return Math.floor(diffMs / 60000);
}

/* ---------------- MESSAGE LOGIC ---------------- */
function getClassCountdownMessage(minutes) {
  if (minutes > 45) {
    return "Plenty of time — let's have bacon and eggs 🥓🍳";
  } else if (minutes > 30) {
    return "Still good — maybe grab a coffee on the way ☕";
  } else if (minutes > 15) {
    return "Better start getting ready — class is coming up 📚";
  } else {
    return "Hurry! You’re cutting it close ⏰";
  }
}
