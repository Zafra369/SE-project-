document.addEventListener("DOMContentLoaded", function () 
{
  // loggedInUser is already set by layout.js before this file runs

  renderPinnedEntries();
  renderPinnedTasks();
});


//list of pinned journal entries
function renderPinnedEntries() 
{
  var entries = getJournalEntries(loggedInUser.username);
  var listContainer = document.getElementById("pinnedEntriesList");

  //list with only the entries that are pinned
  var pinnedEntries = [];
  for (var i = 0; i < entries.length; i++) 
  {
    if (entries[i].pinned === true) {
      pinnedEntries.push(entries[i]);
    }
  }

  if (pinnedEntries.length === 0) 
    {
    listContainer.innerHTML = "<div class='empty-state'><p> No pinned entries yet </p></div>";
    return;
  }

  var htmlText = "";

  for (var j = 0; j < pinnedEntries.length; j++) 
  {
    var entry = pinnedEntries[j];

    var previewText = entry.content;
    if (previewText.length > 140) 
      {
      previewText = previewText.substring(0, 140) + "...";
    }

    htmlText = htmlText + "<div class='entry-card'>";
    htmlText = htmlText + "<div class='entry-card-top'>";
    htmlText = htmlText + "<span class='entry-title'>" + entry.title + "</span>";
    htmlText = htmlText + "<span class='pin-btn' onclick='handleUnpinEntry(\"" + entry.id + "\")'>⭐</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<p class='entry-preview'>" + previewText + "</p>";
    htmlText = htmlText + "<div class='entry-meta'>";
    htmlText = htmlText + "<span>" + entry.createdDate + "</span>";
    htmlText = htmlText + "<span>" + entry.createdTime + "</span>";
    htmlText = htmlText + "<span>" + entry.wordCount + " words</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<div class='entry-actions'>";
    htmlText = htmlText + "<a class='action-link' href='journalEntries.html'>Open in Journal</a>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


//list of pinned tasks
function renderPinnedTasks() 
{
  var tasks = getTasks(loggedInUser.username);
  var listContainer = document.getElementById("pinnedTasksList");

  // Build a list with only the tasks that are pinned
  var pinnedTasks = [];
  for (var i = 0; i < tasks.length; i++) 
    {
    if (tasks[i].pinned === true) {
      pinnedTasks.push(tasks[i]);
    }
  }

  if (pinnedTasks.length === 0) 
    {
    listContainer.innerHTML = "<div class='empty-state'><p> No pinned tasks yet </p></div>";
    return;
  }

  var htmlText = "";

  for (var j = 0; j < pinnedTasks.length; j++) 
    {
    var task = pinnedTasks[j];

    var checkedClass = "";
    var itemCompletedClass = "";
    var statusText = "Pending";
    var statusClass = "pending";

    if (task.completed === true) 
    {
      checkedClass = "checked";
      itemCompletedClass = "completed";
      statusText = "Completed";
      statusClass = "completed";
    }

    htmlText = htmlText + "<div class='task-item " + itemCompletedClass + "'>";
    htmlText = htmlText + "<div class='task-checkbox " + checkedClass + "'></div>";
    htmlText = htmlText + "<div class='task-body'>";
    htmlText = htmlText + "<div class='task-title'>" + task.title + "</div>";
    htmlText = htmlText + "<div class='task-date'>Created: " + task.createdDate + "</div>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<span class='status-badge " + statusClass + "'>" + statusText + "</span>";
    htmlText = htmlText + "<span class='icon-btn' onclick='handleUnpinTask(\"" + task.id + "\")'> ⭐ </span>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


//when the star is clicked on a pinned entry. Unpins it and refreshes
function handleUnpinEntry(entryId) 
{
  toggleJournalEntryPin(loggedInUser.username, entryId);
  showToast("Entry unpinned");
  renderPinnedEntries();
}

// when the star is clicked on a pinned task. Unpins it and refreshes.
function handleUnpinTask(taskId) 
{
  toggleTaskPin(loggedInUser.username, taskId);
  showToast("Task unpinned");
  renderPinnedTasks();
}