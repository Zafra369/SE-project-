document.addEventListener("DOMContentLoaded", function () 
{
  // loggedInUser is already set by layout.js before this file runs

  setupShowFormButton();
  setupCancelButton();
  setupEntryForm();
  setupLiveWordCount();
  setupBackToListButton();

  renderJournalList();
});

// show new entry form when the + New Entry btn is clicked
function setupShowFormButton() 
{
  var showFormBtn = document.getElementById("showFormBtn");

  showFormBtn.addEventListener("click", function () 
  {
    // Make sure the form is empty and ready for a brand new entry
    document.getElementById("formTitle").textContent = "Write a new entry";
    document.getElementById("entryIdField").value = "";
    document.getElementById("entryTitleField").value = "";
    document.getElementById("entryContentField").value = "";
    document.getElementById("liveWordCount").textContent = "0";

    document.getElementById("entryFormCard").style.display = "block";
    document.getElementById("fullEntryCard").style.display = "none";
  });
}


// hide the form when cncl is clicked
function setupCancelButton() 
{
  var cancelBtn = document.getElementById("cancelEntryBtn");

  cancelBtn.addEventListener("click", function () 
  {
    document.getElementById("entryFormCard").style.display = "none";
  });
}


// update word count text as the user types
function setupLiveWordCount() 
{
  var contentField = document.getElementById("entryContentField");
  var countSpot = document.getElementById("liveWordCount");

  contentField.addEventListener("input", function () 
  {
    var currentWordCount = countWords(contentField.value);
    countSpot.textContent = currentWordCount;
  });
}


// handle saving new entry or saving changes to existing entry.
function setupEntryForm() 
{
  var entryForm = document.getElementById("entryForm");

  entryForm.addEventListener("submit", function (event) 
  {
    event.preventDefault();

    var entryIdField = document.getElementById("entryIdField");
    var titleField = document.getElementById("entryTitleField");
    var contentField = document.getElementById("entryContentField");

    var titleValue = titleField.value.trim();
    var contentValue = contentField.value.trim();

    if (titleValue === "" || contentValue === "") 
      {
      alert("Please write both a title and some content.");
      return;
    }

    var existingId = entryIdField.value;

    if (existingId === "") 
      {
      // no id means this is a brand new entry
      addJournalEntry(loggedInUser.username, titleValue, contentValue);
      showToast("Entry saved");
    } else 
      {
      // there is an id, so we are editing an existing entry
      updateJournalEntry(loggedInUser.username, existingId, titleValue, contentValue);
      showToast("Entry updated");
    }

    document.getElementById("entryFormCard").style.display = "none";
    renderJournalList();
  });
}


// hide full entry view and go back to the list
function setupBackToListButton() 
{
  var backBtn = document.getElementById("backToListBtn");

  backBtn.addEventListener("click", function () 
  {
    document.getElementById("fullEntryCard").style.display = "none";
    document.getElementById("entryListSection").style.display = "block";
  });
}


// Draws the full list of journal entries onto the page
function renderJournalList() 
{
  var entries = getJournalEntries(loggedInUser.username);
  var listContainer = document.getElementById("journalEntriesList");

  if (entries.length === 0) 
    {
    listContainer.innerHTML = "<div class='empty-state'><p> Your story starts here </p></div>";
    return;
  }

  var htmlText = "";

  for (var i = 0; i < entries.length; i++) 
    {
    var entry = entries[i];

    var previewText = entry.content;
    if (previewText.length > 140) 
    {
      previewText = previewText.substring(0, 140) + "...";
    }

    var pinClass = "";
    if (entry.pinned === true) 
    {
      pinClass = "pinned";
    }

    htmlText = htmlText + "<div class='entry-card'>";
    htmlText = htmlText + "<div class='entry-card-top'>";
    htmlText = htmlText + "<span class='entry-title'>" + entry.title + "</span>";
    htmlText = htmlText + "<span class='pin-btn " + pinClass + "' onclick='handlePinClick(\"" + entry.id + "\")'> ⭐ </span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<p class='entry-preview'>" + previewText + "</p>";
    htmlText = htmlText + "<div class='entry-meta'>";
    htmlText = htmlText + "<span>" + entry.createdDate + "</span>";
    htmlText = htmlText + "<span>" + entry.createdTime + "</span>";
    htmlText = htmlText + "<span>" + "[" + entry.wordCount + " words ]" + "</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<div class='entry-actions'>";
    htmlText = htmlText + "<span class='action-link' onclick='handleViewClick(\"" + entry.id + "\")'>View</span>";
    htmlText = htmlText + "<span class='action-link' onclick='handleEditClick(\"" + entry.id + "\")'>Edit</span>";
    htmlText = htmlText + "<span class='action-link danger' onclick='handleDeleteClick(\"" + entry.id + "\")'>Delete</span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


//when a pin star is clicked on an entry card
function handlePinClick(entryId) 
{
  toggleJournalEntryPin(loggedInUser.username, entryId);
  renderJournalList();
}


// when "View" is clicked on an entry card. Shows the full entry
function handleViewClick(entryId) 
{
  var entry = getJournalEntryById(loggedInUser.username, entryId);
  if (entry === null) 
    {
    return;
  }

  document.getElementById("fullEntryTitle").textContent = entry.title;
  document.getElementById("fullEntryDate").textContent = entry.createdDate;
  document.getElementById("fullEntryTime").textContent = entry.createdTime;
  document.getElementById("fullEntryWords").textContent = "[" + entry.wordCount +  " words" + "]";
  document.getElementById("fullEntryBody").textContent = entry.content;

  document.getElementById("fullEntryCard").style.display = "block";
  document.getElementById("entryListSection").style.display = "none";
  document.getElementById("entryFormCard").style.display = "none";
}


// when "Edit" is clicked on an entry card. Opens the form pre-filled
function handleEditClick(entryId) 
{
  var entry = getJournalEntryById(loggedInUser.username, entryId);
  if (entry === null) {
    return;
  }

  document.getElementById("formTitle").textContent = "Edit entry";
  document.getElementById("entryIdField").value = entry.id;
  document.getElementById("entryTitleField").value = entry.title;
  document.getElementById("entryContentField").value = entry.content;
  document.getElementById("liveWordCount").textContent = entry.wordCount;

  document.getElementById("entryFormCard").style.display = "block";
  document.getElementById("fullEntryCard").style.display = "none";
  document.getElementById("entryListSection").style.display = "block";
}


//when "Delete" is clicked on entry card
function handleDeleteClick(entryId) 
{
  var sureToDelete = confirm("Delete this journal entry? This cannot be undone.");
  if (sureToDelete === false) 
    {
    return;
  }

  deleteJournalEntry(loggedInUser.username, entryId);
  showToast("Entry deleted");
  renderJournalList();
}