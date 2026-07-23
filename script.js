// ==========================
// DOM Elements
// ==========================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

// ==========================
// Variables
// ==========================

let tasks = [];
let currentFilter = "all";

// ==========================
// Load Tasks
// ==========================

window.onload = () => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
};

// ==========================
// Save Tasks
// ==========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// Add Task
// ==========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();

}

// ==========================
// Delete Task
// ==========================

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();

}

// ==========================
// Toggle Complete
// ==========================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();
    renderTasks();

}

// ==========================
// Edit Task
// ==========================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit Task", task.text);

    if (newText === null) return;

    if (newText.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = newText.trim();

    saveTasks();
    renderTasks();

}

// ==========================
// Clear Completed
// ==========================

function clearCompleted() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

}

// ==========================
// Counter
// ==========================

function updateCounter() {

    const active = tasks.filter(task => !task.completed);

    taskCount.textContent = `Tasks Left: ${active.length}`;

}

// ==========================
// Render Tasks
// ==========================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="task-actions">

                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;

        // Complete

        li.querySelector("input").addEventListener("change", () => {

            toggleTask(task.id);

        });

        // Edit

        li.querySelector(".edit-btn").addEventListener("click", () => {

            editTask(task.id);

        });

        // Delete

        li.querySelector(".delete-btn").addEventListener("click", () => {

            deleteTask(task.id);

        });

        taskList.appendChild(li);

    });

    updateCounter();

}

// ==========================
// Event Listeners
// ==========================

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        addTask();

    }

});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});