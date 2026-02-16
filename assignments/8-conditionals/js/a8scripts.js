const mobileMenu = document.getElementById("mobilemenu");
const hidingList = document.getElementById("hiding");

mobileMenu.onclick = function () {
  // Toggle the list only when mobile mode is active
  if (window.innerWidth < 1000) {
    hidingList.style.display =
      hidingList.style.display === "block" ? "none" : "block";
  }
};

