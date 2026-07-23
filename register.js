document.addEventListener("DOMContentLoaded", function () 
{

  // If the user is already logged in, send them straight to the dashboard.
  var existingUser = getCurrentUser();
  if (existingUser !== null) {
    window.location.href = "dashboard.html";
    return;
  }

  setupPasswordToggles();
  setupRegisterForm();
});


// show/hide a password field
function setupPasswordToggles() 
{
  var toggles = document.querySelectorAll(".password-toggle");

  for (var i = 0; i < toggles.length; i++) 
  {
    toggles[i].addEventListener("click", function () 
    {
      var targetId = this.getAttribute("data-target");
      var passwordField = document.getElementById(targetId);

      if (passwordField === null) 
      {
        return;
      }

      if (passwordField.type === "password")
      {
        passwordField.type = "text";
        this.src = "eyeOpen.png";
        this.alt = "Hide password";
      } 
      else 
      {
        passwordField.type = "password";
        this.src = "close-eye.png";
        this.alt = "Show password";
      }
    });
  }
}


function showFormMessage(messageBox, text, type) 
{
  messageBox.textContent = text;
  messageBox.classList.remove("success");
  messageBox.classList.remove("error");
  messageBox.classList.add(type);
  messageBox.classList.add("show");
}


// Wires up the register form's submit event
function setupRegisterForm() 
{
  var registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", function (event) 
  {

    event.preventDefault(); // stop the page from refreshing

    var usernameField = document.getElementById("registerUsername");
    var emailField = document.getElementById("registerEmail");
    var passwordField = document.getElementById("registerPassword");
    var confirmField = document.getElementById("registerConfirmPassword");
    var messageBox = document.getElementById("registerMessage");

    var usernameValue = usernameField.value.trim();
    var emailValue = emailField.value.trim();
    var passwordValue = passwordField.value;
    var confirmValue = confirmField.value;

    // Check that the required fields were filled in
    if (usernameValue === "" || emailValue === "" || passwordValue === "") 
      {
      showFormMessage(messageBox, "Please fill in all required fields.", "error");
      return;
    }

    // Check that the two password fields match
    if (passwordValue !== confirmValue) 
      {
      showFormMessage(messageBox, "Passwords do not match.", "error");
      return;
    }

    // Check that the password is not too short
    if (passwordValue.length < 4) 
      {
      showFormMessage(messageBox, "Password should be at least 4 characters.", "error");
      return;
    }

    // Try to create the account
    var wasCreated = createUser(usernameValue, emailValue, passwordValue);

    if (wasCreated === false) 
      {
      showFormMessage(messageBox, "That username or email is already registered.", "error");
      return;
    }

    // Account created successfully
    showFormMessage(messageBox, "Account created! Taking you to your dashboard...", "success");
    setCurrentUser(usernameValue);

    // Wait a moment so the user actually sees the success message, then redirect
    window.setTimeout(function () 
    {
      window.location.href = "dashboard.html";
    }, 1200);
  });
}