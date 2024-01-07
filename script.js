let textArea = document.getElementById("user-input");
const checkButton = document.getElementById("input-panel-check-button");
const outputPanel = document.getElementById("output-panel");
const deleteButtons = document.getElementsByClassName("delete-button");
const editButtons = document.getElementsByClassName("edit-button");


// Events listeners
document.addEventListener('DOMContentLoaded', function () {
  refreshTasks();
});
// Makes the text blank when user clicks on the text area
textArea.addEventListener('focusin', function () {
  if (textArea.value === "Add a task") {
    clearTextArea();
  }
});
// Restablishes the default text when user clicks away
textArea.addEventListener('focusout', function () {
  if (textArea.value === "") {
    defaultTextArea();
  }
});
// Adds the task when the button is clicked
checkButton.addEventListener('click', function () {
  createTask(textArea.value);
});
// Adds the task when enter is pressed
textArea.addEventListener('keydown', function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    createTask(textArea.value);
  }
});
// Use event delegation for delete and edit buttons
outputPanel.addEventListener('click', function (e) {
  const target = e.target;
  // Check if the clicked element is a delete button
  if (target.classList.contains('delete-button')) {
    deleteTask(target.parentElement.id);
  }
  // Checks if the clicked element is an edit button
  if (target.classList.contains('edit-button')) {
    editTask(target.parentElement.id);
  }
});

// Text Area Control

function clearTextArea() {
  textArea.value = "";
}
// Sets the text area to default value
function defaultTextArea() {
  textArea.value = "Add a task";
}

// Task Control

class Task {
  // HTML Task Object
  constructor(key, name) {
    this.key = key;
    this.name = name;
  }
  displayFullTask() {
    return (`<div id="${this.key}" class="task"> 
    <p>${this.name}</p> 
    <button aria-label="edit the task" class="edit-button"><i class="fas fa-xl fa-solid fa-pen"></i></button> 
    <button aria-label="delete the task" class="delete-button"><i class="fas fa-xl fa-solid fa-trash"></i></button> 
  </div>`);
  }
}

function createTask(taskName) {
  if (taskName !== "") {
    // Creates a unique key for the task
    const taskKey = `task_${Date.now()}`;

    // Creates the storage item and refreshes the panel
    localStorage.setItem(taskKey, taskName);
    refreshTasks();
  } else {
    alert("Enter a valid name");
  }
  // Text area to blank after entering a task
  clearTextArea();
}

function refreshTasks() {
  // Clears the panel beforehand
  clearPanel();
  // For each key, displays the corresponding value
  for (const key of Object.keys(localStorage)) {
    outputPanel.innerHTML += new Task(key, localStorage.getItem(key)).displayFullTask();
  }
}

function deleteTask(taskId) {
  document.getElementById(taskId).remove();
  localStorage.removeItem(taskId);
}

function editTask(taskId) {
  const taskDiv = document.getElementById(taskId);
  const onEditTextArea = taskDiv.children.item(0);

  // When called, text area is modifiable and get the focus
  onEditTextArea.contentEditable = true;
  onEditTextArea.focus();

  // If Enter is pressed or the focus is lost, changes the local storage data
  onEditTextArea.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
      confirmEdit(taskId, onEditTextArea);

      e.preventDefault();
    }
  });
  onEditTextArea.addEventListener('focusout', function (e) {
    confirmEdit(taskId, onEditTextArea);
  });
}

function confirmEdit(id, object) {
  // Takes the id of the task and replace it with the text within the text area
  localStorage.setItem(id, object.innerText);

  object.contentEditable = false;
}

function clearPanel() {
  outputPanel.innerHTML = '';
}