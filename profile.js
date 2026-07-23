document.addEventListener("DOMContentLoaded", function () 
{
  // loggedInUser is already set by layout.js before this file runs

  fillProfileInfo();
  setupProfileForm();
  setupThemeSwitch();
  setupDeleteAccount();
});


// Fills the profile page with the current user's saved information.
function fillProfileInfo() 
{
  document.getElementById("profileUsernameField").value = loggedInUser.username;
  document.getElementById("profileEmailField").value = loggedInUser.email;
}


// success or"error msg
function showFormMessage(messageBox, text, type) 
{
  messageBox.textContent = text;
  messageBox.classList.remove("success");
  messageBox.classList.remove("error");
  messageBox.classList.add(type);
  messageBox.classList.add("show");
}


// Handles saving changes to the username
function setupProfileForm() 
{
  var profileForm = document.getElementById("profileForm");

  profileForm.addEventListener("submit", function (event) 
  {
    event.preventDefault();

    var usernameField = document.getElementById("profileUsernameField");
    var messageBox = document.getElementById("profileMessage");

    var newUsername = usernameField.value.trim();
    var oldUsername = loggedInUser.username;

    if (newUsername === "") 
      {
      showFormMessage(messageBox, "Username cannot be empty.", "error");
      return;
    }

    if (newUsername === oldUsername) 
      {
      return;
    }

    var takenByOther = findUserByUsernameOrEmail(newUsername);
    if (takenByOther !== null) 
      {
      showFormMessage(messageBox, "That username is already taken.", "error");
      return;
    }

    updateUsername(oldUsername, newUsername);
    setCurrentUser(newUsername);
    loggedInUser.username = newUsername;

    var topbarUsername = document.getElementById("topbarUsername");
    if (topbarUsername !== null)
      {
      topbarUsername.textContent = newUsername;
    }

    showFormMessage(messageBox, "Saved! Dashboard now greets you as " + newUsername + ".", "success");
    showToast("Username updated");
  });
}


// Handles the light/dark theme toggle switch.
function setupThemeSwitch() 
{
  var themeSwitch = document.getElementById("themeSwitch");
  var themeIcon = document.getElementById("themeIcon");

  var currentTheme = getThemePreference(loggedInUser.username);
  if (currentTheme === "dark") 
    {
    themeSwitch.classList.add("on");
    themeIcon.src = "moon.png";
    themeIcon.alt = "Dark mode";
  }

  themeSwitch.addEventListener("click", function () 
  {
    var isCurrentlyOn = themeSwitch.classList.contains("on");

    if (isCurrentlyOn === true) 
      {
      themeSwitch.classList.remove("on");
      themeIcon.src = "sun.png";
      themeIcon.alt = "Light mode";
      applyTheme("light");
      saveThemePreference(loggedInUser.username, "light");
    } else {
      themeSwitch.classList.add("on");
      themeIcon.src = "moon.png";
      themeIcon.alt = "Dark mode";
      applyTheme("dark");
      saveThemePreference(loggedInUser.username, "dark");
    }
  });
}


// Handles permanently deleting the user's account.
function setupDeleteAccount() 
{
  var deleteButton = document.getElementById("deleteAccountBtn");

  deleteButton.addEventListener("click", function () {
    var sureToDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (sureToDelete === false) 
      {
      return;
    }

    deleteUserAccount(loggedInUser.username);
    window.location.href = "home.html";
  });
}