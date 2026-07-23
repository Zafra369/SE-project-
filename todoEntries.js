document.addEventListener("DOMContentLoaded", function () {
  // loggedInUser is already set by layout.js before this file runs

  setupShowFormButton();
  setupCancelButton();
  setupTaskForm();

  renderTaskList();
});


// Shows the "new task" form when the + New Task button is clicked.
function setupShowFormButton() 
{
  var showFormBtn = document.getElementById("showFormBtn");

  showFormBtn.addEventListener("click", function () 
  {
    // Make sure the form is empty and ready for a brand new task
    document.getElementById("formTitle").textContent = "Add a new task";
    document.getElementById("taskIdField").value = "";
    document.getElementById("taskTitleField").value = "";
    document.getElementById("taskDescField").value = "";

    document.getElementById("taskFormCard").style.display = "block";
  });
}


// Hides the form when Cancel is clicked.
function setupCancelButton() 
{
  var cancelBtn = document.getElementById("cancelTaskBtn");

  cancelBtn.addEventListener("click", function () 
  {
    document.getElementById("taskFormCard").style.display = "none";
  });
}


// Handles saving a new task OR saving changes to an existing task.
function setupTaskForm() {
  var taskForm = document.getElementById("taskForm");

  taskForm.addEventListener("submit", function (event) 
  {
    event.preventDefault();

    var taskIdField = document.getElementById("taskIdField");
    var titleField = document.getElementById("taskTitleField");
    var descField = document.getElementById("taskDescField");

    var titleValue = titleField.value.trim();
    var descValue = descField.value.trim();

    if (titleValue === "") {
      alert("Please give the task a title.");
      return;
    }

    var existingId = taskIdField.value;

    if (existingId === "") 
    {
      // No id means this is a brand new task
      addTask(loggedInUser.username, titleValue, descValue);
      showToast("Task added ✅");
    } 
    else 
      {
      // There is an id, so we are editing an existing task
      updateTask(loggedInUser.username, existingId, titleValue, descValue);
      showToast("Task updated");
    }

    document.getElementById("taskFormCard").style.display = "none";
    renderTaskList();
  });
}


// Draws the full list of tasks onto the page.
function renderTaskList() 
{
  var tasks = getTasks(loggedInUser.username);
  var listContainer = document.getElementById("taskListContainer");

  if (tasks.length === 0) 
  {
    listContainer.innerHTML = "<div class='empty-state'><p> No tasks yet. Add your first one</p></div>";
    return;
  }

  var htmlText = "";

  for (var i = 0; i < tasks.length; i++) 
  {
    var task = tasks[i];

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

    var descriptionHtml = "";
    if (task.description !== "") 
    {
      descriptionHtml = "<div class='task-desc'>" + task.description + "</div>";
    }

    var pinClass = "";
    if (task.pinned === true) 
    {
      pinClass = "pinned";
    }

    htmlText = htmlText + "<div class='task-item " + itemCompletedClass + "'>";
    htmlText = htmlText + "<div class='task-checkbox " + checkedClass + "' onclick='handleCheckboxClick(\"" + task.id + "\")'></div>";
    htmlText = htmlText + "<div class='task-body'>";
    htmlText = htmlText + "<div class='task-title'>" + task.title + "</div>";
    htmlText = htmlText + descriptionHtml;
    htmlText = htmlText + "<div class='task-date'>Created: " + task.createdDate + "</div>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "<span class='status-badge " + statusClass + "'>" + statusText + "</span>";
    htmlText = htmlText + "<div class='task-actions'>";
    htmlText = htmlText + "<span class='icon-btn pin-btn " + pinClass + "' onclick='handleTaskPinClick(\"" + task.id + "\")'>⭐</span>";
    htmlText = htmlText + "<span class='icon-btn' onclick='handleTaskEditClick(\"" + task.id + "\")'> <img src=\"pencil.png\" class=\"editTask\"> </span>";
    htmlText = htmlText + "<span class='icon-btn' onclick='handleTaskDeleteClick(\"" + task.id + "\")'> <img src=\"delete.png\" class=\"deleteTask\"> </span>";
    htmlText = htmlText + "</div>";
    htmlText = htmlText + "</div>";
  }

  listContainer.innerHTML = htmlText;
}


// Called when the round checkbox is clicked. Marks task complete/incomplete.
function handleCheckboxClick(taskId) 
{
  toggleTaskCompleted(loggedInUser.username, taskId);
  renderTaskList();
}


// Called when the star is clicked. Pins or unpins the task.
function handleTaskPinClick(taskId) 
{
  toggleTaskPin(loggedInUser.username, taskId);
  renderTaskList();
}


// Called when the pencil icon is clicked. Opens the form pre-filled.
function handleTaskEditClick(taskId) 
{
  var task = getTaskById(loggedInUser.username, taskId);
  if (task === null) 
    {
    return;
  }

  document.getElementById("formTitle").textContent = "Edit task";
  document.getElementById("taskIdField").value = task.id;
  document.getElementById("taskTitleField").value = task.title;
  document.getElementById("taskDescField").value = task.description;

  document.getElementById("taskFormCard").style.display = "block";
}


// Called when the trash icon is clicked.
function handleTaskDeleteClick(taskId) 
{
  var sureToDelete = confirm("Delete this task? This cannot be undone.");
  if (sureToDelete === false) 
  {
    return;
  }

  deleteTask(loggedInUser.username, taskId);
  showToast("Task deleted");
  renderTaskList();
}