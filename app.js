const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    li.innerHTML = `
            ${task.text}
            <div>
                ${
                  !task.done
                    ? `<button class="done" onclick="markDone(${index})"><i class="fas fa-check"></i></button>`
                    : ""
                }
                <button class="edit" onclick="editTask(${index})"><i class="fas fa-pencil-alt"></i></button>
                <button class="delete" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;

    if (task.done) {
      completedTasks.appendChild(li);
    } else {
      pendingTasks.appendChild(li);
    }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = { text: todoInput.value, done: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  todoInput.value = "";
});

function markDone(index) {
  tasks[index].done = true;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit Task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

renderTasks();
