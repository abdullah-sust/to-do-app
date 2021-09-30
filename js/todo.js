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
var incompleteTaskHolder = document.getElementById("incomplete-tasks"); //ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //ul of #completed-tasks

addButton.className = "btn btn-success";
taskInput.className = "input-group flex-nowrap form-control";

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
  listItem.className = "list-group-item";
  checkbox.className = "checkbox " + task.id + " ";
  label.className = "label";
  editInput.className = "input-group flex-nowrap form-control";
  editBtn.className = "btn btn-primary";
  updateBtn.className = "btn btn-success";
  deleteBtn.className = "btn btn-danger";

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
    // console.log(element);
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

  deleteBtn.addEventListener("click", (event) => {
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
    incompleteTaskHolder.appendChild(newItem);
    setLocalStorageData(data);
    taskInput.value = "";
  } else {
    alert("Blank input!");
  }
};

addButton.addEventListener("click", addTask);

// Get all tasks API
var getTaskItems = function () {
  var tasks = getLocalStorageData();
  if (tasks === null) {
    alert("Please add task!");
  } else {
    tasks.forEach((task) => {
      var element = createNewTaskElement(task);
      if (task.is_finish) {
        completedTasksHolder.appendChild(element);
      } else {
        incompleteTaskHolder.appendChild(element);
      }
    });
  }
};

// Calling get all tasks API
getTaskItems();