document.addEventListener("DOMContentLoaded", function () 
{
  // loggedInUser is already set by layout.js before this file runs

  showWelcomeMessage();
  startLiveClock();
  showStats();
  showRecentEntries();
  showRecentTasks();
  
});


// Fills  "Hello, [username]!" heading.
function showWelcomeMessage() 
{
  var welcomeHeading = document.getElementById("welcomeHeading");
  welcomeHeading.textContent = "Hello, " + loggedInUser.username + "!";
}


// update the time every second, and shows today's date.
function startLiveClock() 
{
  updateClock();
  window.setInterval(updateClock, 1000); 
}

function updateClock() 
{
  var now = new Date();

  var timeSpot = document.getElementById("liveTime");
  var dateSpot = document.getElementById("liveDate");

  timeSpot.textContent = formatTimeNice(now);

  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var dayName = dayNames[now.getDay()];

  dateSpot.textContent = dayName + ", " + formatDateNice(now);
}


// total entry count + total task count cards
function showStats() 
{
  var entries = getJournalEntries(loggedInUser.username);
  var tasks = getTasks(loggedInUser.username);

  var journalCountSpot = document.getElementById("journalCount");
  var taskCountSpot = document.getElementById("taskCount");

  journalCountSpot.textContent = entries.length;
  taskCountSpot.textContent = tasks.length;
}


// 3 most recent journal entries, or an empty message if there are none
function showRecentEntries() 
{
  var entries = getJournalEntries(loggedInUser.username);
  var listContainer = document.getElementById("recentEntriesList");

  if (entries.length === 0) 
  {
    listContainer.innerHTML = "<div class='empty-state'><p> Your story starts here </p></div>";
    return;
  }

  var entriesToShow = entries.slice(0, 3); // only the first 3
  var htmlText = "";

  for (var i = 0; i < entriesToShow.length; i++) 
  {
    var entry = entriesToShow[i];

    var previewText = entry.content;
    if (previewText.length > 100)
    {
      previewText = previewText.substring(0, 100) + "...";
    }

    htmlText = htmlText + "<div class='entry-card'>";
    htmlText = htmlText + "<div class='entry-card-top'>";
    htmlText = htmlText + "<span class='entry-title'>" + entry.title + "</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<p class='entry-preview'>" + previewText + "</p>";
    htmlText = htmlText + "<div class='entry-meta'>";
    htmlText = htmlText + "<span>" + entry.createdDate + "</span>";
    htmlText = htmlText + "<span>" + entry.createdTime + "</span>";
    htmlText = htmlText + "<span>" + entry.wordCount + " words</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<a class='action-link' href='journalEntries.html'>View</a>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


// 3 most recent tasks, or an empty message if there are none.
function showRecentTasks() 
{
  var tasks = getTasks(loggedInUser.username);
  var listContainer = document.getElementById("recentTasksList");

  if (tasks.length === 0) 
  {
    listContainer.innerHTML = "<div class='empty-state'><p> No tasks yet. Add your first one </p></div>";
    return;
  }

  var tasksToShow = tasks.slice(0, 3);
  var htmlText = "";

  for (var i = 0; i < tasksToShow.length; i++) 
  {
    var task = tasksToShow[i];

    var statusText = "Pending";
    var statusClass = "pending";
    var itemClass = "";
    if (task.completed === true) 
    {
      statusText = "Completed";
      statusClass = "completed";
      itemClass = "completed";
    }

    htmlText = htmlText + "<div class='task-item " + itemClass + "'>";
    htmlText = htmlText + "<div class='task-body'>";
    htmlText = htmlText + "<div class='task-title'>" + task.title + "</div>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<span class='status-badge " + statusClass + "'>" + statusText + "</span>";
    htmlText = htmlText + "<a class='action-link' href='todoEntries.html'>View</a>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


