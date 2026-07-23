/*the only file that talks directly to localStorage. Every other file asks THIS file for data, instead of touching
localStorage by itself. This keeps things organized.*/

/* keys used inside localStorage */
var STORAGE_KEY_USERS = "pendown_users";
var STORAGE_KEY_CURRENT_USER = "pendown_current_user";
var STORAGE_KEY_ENTRIES = "pendown_entries_";   // username gets added at the end
var STORAGE_KEY_TASKS = "pendown_tasks_";       // username gets added at the end
var STORAGE_KEY_THEME = "pendown_theme_";       // username gets added at the end

// Returns an array of all registered users.
// If nothing is saved yet, it returns an empty array.
function getAllUsers() 
{
  var storedText = localStorage.getItem(STORAGE_KEY_USERS);
  if (storedText === null) 
    {
    return [];
  }
  return JSON.parse(storedText);
}

// Saves the full array of users back into localStorage.
function saveAllUsers(usersArray) 
{
  var textToStore = JSON.stringify(usersArray);
  localStorage.setItem(STORAGE_KEY_USERS, textToStore);
}

// Looks for a user with the given username or email.
// Returns the user object if found, or null if not found.
function findUserByUsernameOrEmail(usernameOrEmail)
 {
  var users = getAllUsers();
  var searchValue = usernameOrEmail.toLowerCase();

  for (var i = 0; i < users.length; i++)
     {
    var user = users[i];
    if (user.username.toLowerCase() === searchValue) 
      {
      return user;
    }
    if (user.email.toLowerCase() === searchValue)
      {
      return user;
    }
  }
  return null;
}

// Creates a new user account and saves it.
// Returns true if it worked, or false if the username/email is already taken.
function createUser(username, email, password) 
{
  var users = getAllUsers();

  var usernameTaken = findUserByUsernameOrEmail(username);
  var emailTaken = findUserByUsernameOrEmail(email);
  if (usernameTaken !== null || emailTaken !== null) 
    {
    return false;
  }

  var newUser = {
    username: username,
    email: email,
    password: password
  };

  users.push(newUser);
  saveAllUsers(users);
  return true;
}

// Checks a login attempt. Returns the user object if the password matches,
// or null if the username/email or password is wrong.
function checkLogin(usernameOrEmail, password) 
{
  var user = findUserByUsernameOrEmail(usernameOrEmail);
  if (user === null) 
    {
    return null;
  }
  if (user.password !== password) 
    {
    return null;
  }
  return user;
}

// Updates the username for an existing user (used on the Profile page).
// Also renames their journal/task/theme storage to match the new username.
function updateUsername(oldUsername, newUsername) 
{
  var users = getAllUsers();

  for (var i = 0; i < users.length; i++) 
    {
    if (users[i].username === oldUsername) 
      {
      users[i].username = newUsername;
    }
  }
  saveAllUsers(users);

  var entries = getJournalEntries(oldUsername);
  var tasks = getTasks(oldUsername);
  var theme = getThemePreference(oldUsername);

  saveJournalEntries(newUsername, entries);
  saveTasks(newUsername, tasks);
  saveThemePreference(newUsername, theme);

  localStorage.removeItem(STORAGE_KEY_ENTRIES + oldUsername);
  localStorage.removeItem(STORAGE_KEY_TASKS + oldUsername);
  localStorage.removeItem(STORAGE_KEY_THEME + oldUsername);
}

// Saves the username of the person who just logged in.
function setCurrentUser(username) 
{
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, username);
}

// Returns the username of the currently logged in person, or null if
// nobody is logged in.
function getCurrentUsername() 
{
  return localStorage.getItem(STORAGE_KEY_CURRENT_USER);
}

// Returns the full user object of whoever is currently logged in.
function getCurrentUser() 
{
  var username = getCurrentUsername();
  if (username === null) {
    return null;
  }
  return findUserByUsernameOrEmail(username);
}

// Logs the current user out.
function logoutCurrentUser()
 {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
}


// Returns the array of journal entries that belong to one username

function getJournalEntries(username) 
{
  var storedText = localStorage.getItem(STORAGE_KEY_ENTRIES + username);
  if (storedText === null) 
    {
    return [];
  }
  return JSON.parse(storedText);
}

// Saves the full array of journal entries for one username

function saveJournalEntries(username, entriesArray) 
{
  var textToStore = JSON.stringify(entriesArray);
  localStorage.setItem(STORAGE_KEY_ENTRIES + username, textToStore);
}

// Adds one new journal entry for a username
function addJournalEntry(username, title, content)
{
  var entries = getJournalEntries(username);

  var now = new Date();
  var wordCount = countWords(content);

  var newEntry = {
    id: String(now.getTime()),
    title: title,
    content: content,
    createdDate: formatDateNice(now),
    createdTime: formatTimeNice(now),
    wordCount: wordCount,
    pinned: false
  };

  entries.unshift(newEntry); // newest entry goes to the front of the list
  saveJournalEntries(username, entries);
}

// Updates the title and content of an existing entry (used when editing).
function updateJournalEntry(username, entryId, newTitle, newContent) 
{
  var entries = getJournalEntries(username);

  for (var i = 0; i < entries.length; i++) 
    {
    if (entries[i].id === entryId) {
      entries[i].title = newTitle;
      entries[i].content = newContent;
      entries[i].wordCount = countWords(newContent);
    }
  }
  saveJournalEntries(username, entries);
}

// Removes a journal entry by its id.
function deleteJournalEntry(username, entryId) 
{
  var entries = getJournalEntries(username);
  var remainingEntries = [];

  for (var i = 0; i < entries.length; i++) 
    {
    if (entries[i].id !== entryId) {
      remainingEntries.push(entries[i]);
    }
  }
  saveJournalEntries(username, remainingEntries);
}

// Finds one journal entry by its id. Returns null if not found.
function getJournalEntryById(username, entryId) 
{
  var entries = getJournalEntries(username);
  for (var i = 0; i < entries.length; i++) 
    {
    if (entries[i].id === entryId)
       {
      return entries[i];
    }
  }
  return null;
}

// Flips the pinned state of a journal entry (pinned becomes unpinned, or the reverse).
function toggleJournalEntryPin(username, entryId) 
{
  var entries = getJournalEntries(username);
  for (var i = 0; i < entries.length; i++) 
    {
    if (entries[i].id === entryId) 
      {
      entries[i].pinned = !entries[i].pinned;
    }
  }
  saveJournalEntries(username, entries);
}

// Returns the array of tasks that belong to one username.
function getTasks(username) 
{
  var storedText = localStorage.getItem(STORAGE_KEY_TASKS + username);
  if (storedText === null) 
    {
    return [];
  }
  return JSON.parse(storedText);
}

// Saves the full array of tasks for one username.
function saveTasks(username, tasksArray) 
{
  var textToStore = JSON.stringify(tasksArray);
  localStorage.setItem(STORAGE_KEY_TASKS + username, textToStore);
}

// Adds one new task for a username.
function addTask(username, title, description) 
{
  var tasks = getTasks(username);

  var now = new Date();

  var newTask = {
    id: String(now.getTime()),
    title: title,
    description: description,
    createdDate: formatDateNice(now),
    completed: false,
    pinned: false
  };

  tasks.unshift(newTask);
  saveTasks(username, tasks);
}

// Updates the title and description of an existing task (used when editing).
function updateTask(username, taskId, newTitle, newDescription) 
{
  var tasks = getTasks(username);
  for (var i = 0; i < tasks.length; i++)
     {
    if (tasks[i].id === taskId) 
      {
      tasks[i].title = newTitle;
      tasks[i].description = newDescription;
    }
  }
  saveTasks(username, tasks);
}

// Removes a task by its id.
function deleteTask(username, taskId) 
{
  var tasks = getTasks(username);
  var remainingTasks = [];

  for (var i = 0; i < tasks.length; i++) 
    {
    if (tasks[i].id !== taskId) 
      {
      remainingTasks.push(tasks[i]);
    }
  }
  saveTasks(username, remainingTasks);
}

// Finds one task by its id. Returns null if not found.
function getTaskById(username, taskId) 
{
  var tasks = getTasks(username);
  for (var i = 0; i < tasks.length; i++) 
    {
    if (tasks[i].id === taskId)
       {
      return tasks[i];
    }
  }
  return null;
}

// Flips a task between completed and not completed.
function toggleTaskCompleted(username, taskId) 
{
  var tasks = getTasks(username);
  for (var i = 0; i < tasks.length; i++) 
    {
    if (tasks[i].id === taskId) 
      {
      tasks[i].completed = !tasks[i].completed;
    }
  }
  saveTasks(username, tasks);
}

// Flips the pinned state of a task.
function toggleTaskPin(username, taskId)
 {
  var tasks = getTasks(username);
  for (var i = 0; i < tasks.length; i++) 
    {
    if (tasks[i].id === taskId)
      {
      tasks[i].pinned = !tasks[i].pinned;
    }
  }
  saveTasks(username, tasks);
}

// Returns "light" or "dark" for a username. Defaults to "light"

function getThemePreference(username) 
{
  var storedValue = localStorage.getItem(STORAGE_KEY_THEME + username);
  if (storedValue === null) 
    {
    return "light";
  }
  return storedValue;
}

// Saves "light" or "dark" as the theme preference for a username.
function saveThemePreference(username, themeValue)
 {
  localStorage.setItem(STORAGE_KEY_THEME + username, themeValue);
}


// Counts the number of words in a piece of text

function countWords(text) 
{
  var trimmedText = text.trim();
  if (trimmedText === "") 
    {
    return 0;
  }
  var wordsArray = trimmedText.split(/\s+/);
  return wordsArray.length;
}

// Turns a Date object into a nice reading format, example: "16 July 2026"
function formatDateNice(dateObject) 
{
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  var day = dateObject.getDate();
  var month = monthNames[dateObject.getMonth()];
  var year = dateObject.getFullYear();

  return day + " " + month + " " + year;
}

// Turns a Date object into a nice reading format, example: "8:30 PM"
function formatTimeNice(dateObject) 
{
  var hours = dateObject.getHours();
  var minutes = dateObject.getMinutes();

  var period = "AM";
  if (hours >= 12) 
    {
    period = "PM";
  }

  var hours12 = hours % 12;
  if (hours12 === 0) 
    {
    hours12 = 12;
  }

  var minutesText = String(minutes);
  if (minutes < 10)
     {
    minutesText = "0" + minutes;
  }

  return hours12 + ":" + minutesText + " " + period;
}

//delete account

// Permanently deletes a user account and all of their journal entries,
// tasks, and theme preference. Also logs them out.
function deleteUserAccount(username)
 {
  var users = getAllUsers();
  var remainingUsers = [];

  for (var i = 0; i < users.length; i++) 
    {
    if (users[i].username !== username) 
    {
      remainingUsers.push(users[i]);
    }
  }
  saveAllUsers(remainingUsers);

  localStorage.removeItem(STORAGE_KEY_ENTRIES + username);
  localStorage.removeItem(STORAGE_KEY_TASKS + username);
  localStorage.removeItem(STORAGE_KEY_THEME + username);
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
}