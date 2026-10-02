const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");

function addMessage(text, type) {
  const el = document.createElement("div");
  el.className = `message ${type}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

async function ask(question) {
  addMessage(question, "user");
  input.value = "";
  const loading = document.createElement("div");
  loading.className = "message bot";
  loading.textContent = "Searching campus information...";
  chat.appendChild(loading);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: question})
    });
    const data = await res.json();
    loading.remove();
    addMessage(data.answer || data.error || "No answer available.", "bot");
  } catch (e) {
    loading.remove();
    addMessage("Unable to contact the assistant.", "bot");
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const q = input.value.trim();
  if (q) ask(q);
});

document.querySelectorAll("[data-q]").forEach(btn => {
  btn.addEventListener("click", () => ask(btn.dataset.q));
});
