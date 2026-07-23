document.addEventListener("DOMContentLoaded", function () 
{

  // if the user is already logged in, send to dashboard
  var existingUser = getCurrentUser();
  if (existingUser !== null) 
    {
    window.location.href = "dashboard.html";
    return;
  }

  setupPasswordToggle();
  setupLoginForm();
});


// show/hide the password
function setupPasswordToggle() 
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


// success or error msg
function showFormMessage(messageBox, text, type) 
{
  messageBox.textContent = text;
  messageBox.classList.remove("success");
  messageBox.classList.remove("error");
  messageBox.classList.add(type);
  messageBox.classList.add("show");
}


// Wires up the login form's submit event.
function setupLoginForm() 
{
  var loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) 
  {
    event.preventDefault(); // stop the page from refreshing

    var usernameField = document.getElementById("loginUsername");
    var passwordField = document.getElementById("loginPassword");
    var messageBox = document.getElementById("loginMessage");

    var usernameValue = usernameField.value.trim();
    var passwordValue = passwordField.value;

    // Check that both fields were filled in
    if (usernameValue === "" || passwordValue === "") 
    {
      showFormMessage(messageBox, "Please fill in both fields.", "error");
      return;
    }

    // Check the username/email and password against saved accounts
    var matchedUser = checkLogin(usernameValue, passwordValue);

    if (matchedUser === null) 
      {
      showFormMessage(messageBox, "Incorrect username/email or password.", "error");
      return;
    }

    // Login was successful
    showFormMessage(messageBox, "Welcome back! Taking you to your dashboard...", "success");
    setCurrentUser(matchedUser.username);

    // Wait a moment so the user actually sees the success message, then redirect
    window.setTimeout(function () 
    {
      window.location.href = "dashboard.html";
    }, 1000);
  });
}