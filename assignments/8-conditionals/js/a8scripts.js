const mobileMenu = document.getElementById("mobilemenu");
const hidingList = document.getElementById("hiding");

mobileMenu.onclick = function () {
  // Toggle the list only when mobile mode is active
  if (window.innerWidth < 1000) {
    hidingList.style.display =
      hidingList.style.display === "block" ? "none" : "block";
  }
};

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

  const mobileMenu = document.getElementById("mobilemenu");
const hidingList = document.getElementById("hiding");

mobileMenu.addEventListener("click", function () {
  // Toggle visibility
  const isOpen = hidingList.style.display === "block";

  hidingList.style.display = isOpen ? "none" : "block";

  // Toggle arrow rotation
  mobileMenu.classList.toggle("open", !isOpen);
});


  return "Class started a while ago… maybe review the notes later 🤷‍♂️";
}

