// Get Local Storage Data API
var getLocalStorageData = () => {
  return JSON.parse(localStorage.getItem("data"));
};

// Set Local Storage Data API
var setLocalStorageData = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
  return;
};

var totalTasks;
var taskInput = document.getElementById("new-task"); //Add a new task.
var addButton = document.getElementById("btn-add"); //Add button
var searchInput = document.getElementById("search-box"); //Add a new task.

var incompleteTaskHolder = document.getElementById("incomplete-tasks"); //ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //ul of #completed-tasks

addButton.className = "btn btn-success";
taskInput.className = "input-group flex-nowrap form-control";
searchInput.className = "input-group flex-nowrap form-control";

//Create new task list item
var createNewTaskElement = function (task) {
  // create element
  var listItem = document.createElement("li");
  var checkbox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editBtn = document.createElement("button");
  var updateBtn = document.createElement("button");
  var deleteBtn = document.createElement("button");

  // Set elememnt id
  listItem.id = task.id;

  // adding class name
  listItem.className = "custom-li list-group-item";
  checkbox.className = "checkbox " + task.id + " ";
  label.className = "task-label";
  editInput.className = "input-group form-control edit-input";
  editBtn.className = "btn btn-primary edit-btn";
  updateBtn.className = "btn btn-success update-btn";
  deleteBtn.className = "btn btn-danger delete-btn";

  // adding element type
  checkbox.type = "checkbox";
  editInput.type = "text";
  editBtn.type = "button";
  updateBtn.type = "button";
  deleteBtn.type = "button";

  // adding inner text or value
  label.innerHTML = task.value;
  editInput.value = task.value;
  editBtn.innerHTML = "Edit";
  updateBtn.innerHTML = "Update";
  deleteBtn.innerHTML = "Delete";
  checkbox.checked = task.is_finish;

  // initially hiding input field
  editBtn.removeAttribute("hidden");
  updateBtn.setAttribute("hidden", true);
  editInput.setAttribute("hidden", true);
  label.removeAttribute("hidden");

  listItem.appendChild(checkbox);
  listItem.appendChild(editInput);
  listItem.appendChild(label);
  listItem.appendChild(editBtn);
  listItem.appendChild(updateBtn);
  listItem.appendChild(deleteBtn);
  listItem.setAttribute('draggable', true);

  // onclick checkbox event handling
  checkbox.addEventListener("click", (event) => {
    var id = event.target.className.split(" ")[1];
    var element = event.target.parentNode;
    if (event.target.checked) {
      // set as complete
      element.parentNode.removeChild(element);
      completedTasksHolder.prepend(element);
    } else {
      // set as incomplete
      element.parentNode.removeChild(element);
      incompleteTaskHolder.prepend(element);
    }

    var data = getLocalStorageData();
    data.forEach((item) => {
      if (item.id.toString() === id) {
        item.is_finish = event.target.checked;
      }
    });
    setLocalStorageData(data);
  });
  // onclick checkbox event handling
  editBtn.addEventListener("click", (event) => {
    var element = event.target.parentNode;
    element.childNodes[1].removeAttribute("hidden");
    element.childNodes[2].setAttribute("hidden", true);
    element.childNodes[3].setAttribute("hidden", true);
    element.childNodes[4].removeAttribute("hidden");
  });

  // onclick update event handling
  updateBtn.addEventListener("click", (event) => {
    var element = event.target.parentNode;
    var id = element.id;
    var value = element.childNodes[1].value;

    element.childNodes[2].innerHTML = value;
    element.childNodes[1].setAttribute("hidden", true);
    element.childNodes[2].removeAttribute("hidden");
    element.childNodes[3].removeAttribute("hidden");
    element.childNodes[4].setAttribute("hidden", true);

    var data = getLocalStorageData();
    data.forEach((item) => {
      if (item.id.toString() === id) {
        item.value = value;
      }
    });
    setLocalStorageData(data);
  });

  var deleteTask = (event) => {
    var target = event.target;
    var element = target.parentNode;
    var id = element.id;
    element.parentNode.removeChild(element);
    var data = getLocalStorageData();
    var selectedItem;

    data.forEach((item) => {
      if (item.id.toString() === id) {
        selectedItem = item;
      }
    });
    data.splice(data.indexOf(selectedItem), 1);
    setLocalStorageData(data);
  };

  //  Delete confirm alert 
  deleteBtn.addEventListener("click", (event) => {
    var isDelete = confirm("Do you want to delete this task?");
    if (isDelete) {
      deleteTask(event);
    }
  });

  var selectedElement = null;
  var selectedElementId = null;
  var selectedParentId = null;

  function allowDrop(event) {
    event.preventDefault();
  }

  var updateLocalStorageDataAfterDragDrop = (is_finish) => {
    var tasks = getLocalStorageData();
    tasks.forEach((task) => {
      if ( task.id.toString() === selectedElementId.toString()) {
        task.is_finish = is_finish;
      }
    });
    setLocalStorageData(tasks);
  };

  completedTasksHolder.addEventListener("drop", (event) => {
    selectedElement.remove();
    selectedElement.childNodes[0].checked = true;
    document.getElementById('completed-tasks').prepend(selectedElement);
    updateLocalStorageDataAfterDragDrop(true);
  });

  completedTasksHolder.addEventListener("dragover", (event) => {
    allowDrop(event);
  });

  incompleteTaskHolder.addEventListener("drop", (event) => {
    selectedElement.remove();
    selectedElement.childNodes[0].checked = false;
    document.getElementById('incomplete-tasks').prepend(selectedElement);
    updateLocalStorageDataAfterDragDrop(false);
  });

  incompleteTaskHolder.addEventListener("dragover", (event) => {
    allowDrop(event);
  });

  listItem.addEventListener("dragstart", (event) => {
    selectedElementId = event.target.id
    selectedParentId = event.target.parentNode.id
    selectedElement = document.getElementById(selectedElementId);
  });

  return listItem;
};

// Adding all tasks
var addTask = function () {
  if (taskInput.value !== "") {
    var data = getLocalStorageData();
    if (data === null) {
      data = [];
      totalTasks = 0;
    } else {
      totalTasks = data.length;
    }
    var task = { id: totalTasks, value: taskInput.value, is_finish: false };
    ++totalTasks;
    data.push(task);
    var newItem = createNewTaskElement(task);
    incompleteTaskHolder.prepend(newItem);
    setLocalStorageData(data);
    taskInput.value = "";
  } else {
    alert("Blank input!");
  }
};

//
taskInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    console.log(event.keyCode);
    event.preventDefault();
    addButton.click();
  }
});

// Event handler for new task item
addButton.addEventListener("click", addTask);

// Generating both complete and incomplete tasks
var generateElements = (tasks) => {
  tasks.forEach((task) => {
    var element = createNewTaskElement(task);
    if (task.is_finish) {
      completedTasksHolder.appendChild(element);
    } else {
      incompleteTaskHolder.appendChild(element);
    }
  });
};

// Get all tasks API on the basis of task type
var getTaskItems = function (type, tasks) {
  completedTasksHolder.innerHTML = "";
  incompleteTaskHolder.innerHTML = "";
  if (type === "all") {
    if (tasks === null) {
      alert("Please add task!");
    } else {
      generateElements(tasks);
    }
  } else {
    generateElements(tasks);
  }
};

// Calling get all tasks API
getTaskItems("all", getLocalStorageData());

// Search on all tasks
var searchTask = (event) => {
  var element = event.target;
  var value = element.value;

  if (value.length > 2) {
    var data = getLocalStorageData();
    var newTaskArray = [];
    data.forEach((task) => {
      if (task.value === value) {
        newTaskArray.push(task);
      }
    });
    if (newTaskArray.length > 0) {
      getTaskItems("filtered", newTaskArray);
    }
  } else {
    getTaskItems("all", getLocalStorageData());
  }
};

// Search input box event handler
searchInput.addEventListener("keyup", searchTask);
