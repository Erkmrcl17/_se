const API = "/api/tasks";
let tasks = [];
let currentView = "all";
let editingId = null;

const $ = (selector) => document.querySelector(selector);
const list = $("#task-list");
const form = $("#task-form");
const backdrop = $("#modal-backdrop");

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function prettyDate(value) {
  if (!value) return "No deadline";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function isDueSoon(task) {
  if (!task.due_date) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(`${task.due_date}T00:00:00`);
  const diff = (due - today) / 86400000;
  return diff <= 2 && diff >= 0;
}
function visibleTasks() {
  const query = $("#search-input").value.trim().toLowerCase();
  const category = $("#category-filter").value;
  return tasks.filter(task => {
    const matchesView = currentView === "today" ? (!task.completed && isDueSoon(task))
      : currentView === "completed" ? !!task.completed : true;
    const matchesCategory = category === "all" || task.category === category;
    const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(query);
    return matchesView && matchesCategory && matchesSearch;
  });
}
function render() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  $("#total-count").textContent = total;
  $("#active-count").textContent = total - completed;
  $("#completed-count").textContent = completed;
  $("#completion-rate").textContent = total ? `${Math.round(completed / total * 100)}%` : "0%";
  $("#task-summary").textContent = `${visibleTasks().length} task(s) shown`;
  const items = visibleTasks();
  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><strong>No tasks found</strong>Try adding a task or changing your filters.</div>`;
    return;
  }
  list.innerHTML = items.map(task => `
    <article class="task-row ${task.completed ? "done" : ""}">
      <button class="check-btn" data-action="toggle" data-id="${task.id}" aria-label="Toggle task">${task.completed ? "✓" : ""}</button>
      <div class="task-main"><div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-description">${escapeHtml(task.description || "No description added")}</div></div>
      <div class="task-meta"><span class="pill">${escapeHtml(task.category)}</span>
        <span class="pill priority-${task.priority.toLowerCase()}">${escapeHtml(task.priority)}</span></div>
      <div class="task-date">${prettyDate(task.due_date)}</div>
      <div class="task-actions"><button class="icon-btn" data-action="edit" data-id="${task.id}" aria-label="Edit task">✎</button>
        <button class="icon-btn" data-action="delete" data-id="${task.id}" aria-label="Delete task">⌫</button></div>
    </article>`).join("");
}
async function loadTasks() {
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Could not load tasks.");
    tasks = await response.json();
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><strong>Could not connect to the server</strong>${escapeHtml(error.message)} Check your Worker and D1 setup.</div>`;
  }
}
function openModal(task = null) {
  editingId = task ? task.id : null;
  form.reset();
  $("#modal-title").textContent = task ? "Edit task" : "Create a task";
  $("#form-error").textContent = "";
  if (task) {
    for (const key of ["title", "description", "category", "priority", "due_date"]) {
      form.elements[key].value = task[key] || "";
    }
  }
  backdrop.hidden = false;
  form.elements.title.focus();
}
function closeModal() { backdrop.hidden = true; editingId = null; }
async function saveTask(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const url = editingId ? `${API}/${editingId}` : API;
  const method = editingId ? "PATCH" : "POST";
  try {
    const response = await fetch(url, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save task.");
    closeModal();
    showToast(editingId ? "Task updated successfully." : "Task created successfully.");
    await loadTasks();
  } catch (error) { $("#form-error").textContent = error.message; }
}
async function taskAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const action = button.dataset.action;
  try {
    if (action === "edit") return openModal(task);
    if (action === "delete") {
      if (!confirm(`Delete "${task.title}"?`)) return;
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete task.");
      showToast("Task deleted.");
    } else if (action === "toggle") {
      const response = await fetch(`${API}/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!response.ok) throw new Error("Could not update task.");
      showToast(task.completed ? "Task marked as active." : "Task completed. Nice work!");
    }
    await loadTasks();
  } catch (error) { showToast(error.message); }
}

$("#open-modal").addEventListener("click", () => openModal());
$("#close-modal").addEventListener("click", closeModal);
$("#cancel-modal").addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
form.addEventListener("submit", saveTask);
list.addEventListener("click", taskAction);
$("#search-input").addEventListener("input", render);
$("#category-filter").addEventListener("change", render);
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  currentView = button.dataset.view;
  $("#page-title").textContent = currentView === "today" ? "Due soon" : currentView === "completed" ? "Completed" : "Overview";
  $("#list-heading").textContent = currentView === "today" ? "Tasks due soon" : currentView === "completed" ? "Completed tasks" : "Your tasks";
  render();
}));
$("#today-label").textContent = new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });
loadTasks();
