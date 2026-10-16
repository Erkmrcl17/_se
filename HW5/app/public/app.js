
const apiStatus = document.getElementById("apiStatus");
const dbStatus = document.getElementById("dbStatus");
const messagesContainer = document.getElementById("messages");
const messageCount = document.getElementById("messageCount");
const lastUpdated = document.getElementById("lastUpdated");
const refreshButton = document.getElementById("refreshButton");

function setStatus(element, isOnline, text) {
    element.textContent = text;
    element.className = `status-badge ${isOnline ? "online" : "offline"}`;
}

async function loadDashboard() {
    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";

    try {
        const response = await fetch("/api/health");
        const health = await response.json();

        setStatus(
            apiStatus,
            response.ok,
            response.ok ? "Online" : "Offline"
        );

        const databaseConnected =
            response.ok && health.database === "connected";

        setStatus(
            dbStatus,
            databaseConnected,
            databaseConnected ? "Connected" : "Disconnected"
        );

        if (!response.ok) {
            throw new Error("Backend or database is unavailable.");
        }

        const messagesResponse = await fetch("/api/messages");

        if (!messagesResponse.ok) {
            throw new Error("Failed to retrieve database messages.");
        }

        const messages = await messagesResponse.json();

        messageCount.textContent =
            `${messages.length} ${messages.length === 1 ? "record" : "records"}`;

        messagesContainer.replaceChildren();

        if (messages.length === 0) {
            messagesContainer.textContent = "No data available.";
        }

        messages.forEach((item) => {
            const article = document.createElement("article");
            article.className = "message-item";

            const message = document.createElement("p");
            message.textContent = item.message;

            const date = document.createElement("small");
            date.textContent = new Date(item.created_at).toLocaleString("en-US");

            article.append(message, date);
            messagesContainer.appendChild(article);
        });

        lastUpdated.textContent =
            `Last updated: ${new Date().toLocaleTimeString("en-US")}`;

    } catch (error) {
        setStatus(apiStatus, false, "Offline");
        setStatus(dbStatus, false, "Unavailable");

        messagesContainer.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className = "error";
        errorMessage.textContent = error.message;

        messagesContainer.appendChild(errorMessage);
        messageCount.textContent = "0 records";

    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Refresh Data";
    }
}

refreshButton.addEventListener("click", loadDashboard);

loadDashboard();
