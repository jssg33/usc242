/* ---------------- MOBILE MENU ---------------- */
const mobileMenuHeader = document.getElementById("mobilemenu-header");
const mobileMenu = document.getElementById("mobilemenu");
const hidingList = document.getElementById("hiding");

mobileMenuHeader.addEventListener("click", () => {
  if (window.innerWidth < 1000) {
    const isOpen = hidingList.style.display === "block";
    hidingList.style.display = isOpen ? "none" : "block";
    mobileMenu.classList.toggle("open", !isOpen);
  }
});

/* ---------------- MENU ITEM LISTENERS ---------------- */
document.getElementById("q1").addEventListener("click", () => ex1());
document.getElementById("q2").addEventListener("click", () => ex2());

document.getElementById("mobile-ex1").addEventListener("click", () => ex1());
document.getElementById("mobile-ex2").addEventListener("click", () => ex2());

/* ---------------- EXERCISE 2 ---------------- */
const getExercise2Message = () => {
  const now = new Date();
  const classTime = new Date();
  classTime.setHours(8, 30, 0, 0);

  const diffMs = classTime - now;
  const diffMinutes = Math.floor(diffMs / 60000);

  // include minutes directly in the returned string
  return `${getMessageForRange(diffMinutes)} (Minutes until class: ${diffMinutes})`;
};

const getMessageForRange = (minutes) => {
  if (minutes > 15) return "Plenty of time — maybe grab a smoothie and chill 😎";
  if (minutes > 10) return "You’re doing great — still a comfy buffer ⏳";
  if (minutes > 5) return "Starting to get close — better get moving 🚶‍♂️💨";
  if (minutes >= 0) return "Class is about to start — hustle mode activated 🏃‍♀️🔥";

  const late = Math.abs(minutes);

  if (late <= 5) return "Class just started — slip in quietly 😬";
  if (late <= 15) return "You're a bit late — but still worth showing up 📘";

  return "Class started a while ago… maybe review the notes later 🤷‍♂️";
};

/* ---------------- EXERCISE 1 ---------------- */
const ex1 = () => {
  document.getElementById("conditionalquestion").innerHTML =
    "How many minutes until class?";

  const minutes = getMinutesUntilNextClass();
  const text = getClassCountdownMessage(minutes);

  const slider = document.getElementById("timeSlider");
  const message = document.getElementById("message");
  const timeVar = document.getElementById("timevariable");

  slider.style.display = "block"; // show slider for Exercise 1

  timeVar.textContent = `Minutes until class: ${minutes}`;
  message.textContent = text;

  slider.oninput = () => {
    const newMinutes = Number(slider.value);
    timeVar.textContent = `Minutes until class: ${newMinutes}`;
    message.textContent = getClassCountdownMessage(newMinutes);
  };
};

/* ---------------- EXERCISE 2 ---------------- */
const ex2 = () => {
  document.getElementById("conditionalquestion").innerHTML = "Countdown to class";
  document.getElementById("message").textContent = getExercise2Message();

  // hide slider for Exercise 2
  document.getElementById("timeSlider").style.display = "none";

  // clear the timevariable block
  document.getElementById("timevariable").textContent = "";
};

/* ---------------- TIME CALCULATION ---------------- */
const getMinutesUntilNextClass = () => {
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
};

/* ---------------- MESSAGE LOGIC ---------------- */
const getClassCountdownMessage = (minutes) => {
  if (minutes > 45) return "Plenty of time — let's have bacon and eggs 🥓🍳";
  if (minutes > 30) return "Still good — maybe grab a coffee on the way ☕";
  if (minutes > 15) return "Better start getting ready — class is coming up 📚";
  return "Hurry! You’re cutting it close ⏰";
};
