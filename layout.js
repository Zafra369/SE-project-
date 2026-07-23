/*runs on every logged-in page. handles things that are the same on every page: */

// This variable holds the currently logged in user's data.Other page-specific JS files (like dashboard.js) read this variable.

var loggedInUser = null;


// Runs as soon as the page's HTML has loaded
document.addEventListener("DOMContentLoaded", function () 
{

  // check if someone is logged in. If not, send them to the login page
  loggedInUser = getCurrentUser();
  if (loggedInUser === null) 
  {
    window.location.href = "login.html";
    return;
  }

  // apply this user's saved theme (light or dark)
  applyTheme(getThemePreference(loggedInUser.username));

  // fill the top bar with the user's name and avatar
  fillTopBar();

  //highlight the correct sidebar link for the current page
  highlightActiveSidebarLink();

  // wire up the mobile menu button and sidebar overlay
  setupMobileSidebar();

  // wire up the logout button, if this page has one
  setupLogoutButton();
});


//fill the top bar username with the logged in user's info.
function fillTopBar() 
{
  var usernameSpot = document.getElementById("topbarUsername");

  if (usernameSpot !== null) {
    usernameSpot.textContent = loggedInUser.username;
  }
}





// Looks at the current page's file name and adds the "active" class
// to the matching sidebar link.
function highlightActiveSidebarLink() {
  var currentPage = window.location.pathname.split("/").pop();
  var sidebarLinks = document.querySelectorAll(".sidebar-link");

  for (var i = 0; i < sidebarLinks.length; i++) {
    var linkTarget = sidebarLinks[i].getAttribute("href");
    if (linkTarget === currentPage) {
      sidebarLinks[i].classList.add("active");
    } else {
      sidebarLinks[i].classList.remove("active");
    }
  }
}


// Handles opening and closing the sidebar on small screens.
function setupMobileSidebar() {
  var menuToggleButton = document.getElementById("menuToggleBtn");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebarOverlay");
  var closeButton = document.getElementById("sidebarCloseBtn");

  if (menuToggleButton !== null) {
    menuToggleButton.addEventListener("click", function () {
      sidebar.classList.add("open");
      overlay.classList.add("show");
    });
  }

  if (closeButton !== null) {
    closeButton.addEventListener("click", function () {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }

  if (overlay !== null) {
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }
}


// Wires up the logout button (id="logoutBtn") to log the user out.
// Only the Profile page has this button, so we check it exists first.
function setupLogoutButton() {
  var logoutButton = document.getElementById("logoutBtn");

  if (logoutButton !== null) {
    logoutButton.addEventListener("click", function () {
      logoutCurrentUser();
      window.location.href = "login.html";
    });
  }
}


// Applies "light" or "dark" theme by adding/removing a class on <body>.
function applyTheme(themeValue) {
  if (themeValue === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}


// Shows a small toast message at the bottom of the screen for a couple seconds.
// Example: showToast("Task added!");
function showToast(message) {
  var toastElement = document.getElementById("toastBox");

  if (toastElement === null) {
    return; // this page has no toast box, so just skip it
  }

  toastElement.textContent = message;
  toastElement.classList.add("show");

  window.setTimeout(function () {
    toastElement.classList.remove("show");
  }, 2200);
}