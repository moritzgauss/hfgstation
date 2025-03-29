document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    const liveBanner = document.getElementById("liveBanner");
    const toggleHeader = document.getElementById("toggleHeader");
    const showsContainer = document.getElementById("showsContainer");
    const chatTrigger = document.getElementById("chatTrigger");
    const chatContainer = document.getElementById("chatContainer");
    const chatTriggerText = document.getElementById("chatTriggerText");

    let isPlaying = false;
    let isChatOpen = false;

    // 🎵 Play/Pause Button Logic
    playButton.addEventListener("click", () => {
        isPlaying = !isPlaying;
        playButton.classList.toggle("playing");

        if (isPlaying) {
            liveBanner.classList.add("show");
            const contents = document.querySelectorAll(".marquee-content");
            contents.forEach((content) => {
                content.style.animation = "none";
                void content.offsetHeight; // Trigger reflow to restart animation
                content.style.animation = "marquee 15s linear infinite";
            });
        } else {
            liveBanner.classList.remove("show");
        }
    });

    // 📅 Shows Container Toggle Logic
    toggleHeader.addEventListener("click", () => {
        showsContainer.classList.toggle("show");
        toggleHeader.textContent = showsContainer.classList.contains("show")
            ? "Vergangene Sendungen ▲"
            : "Vergangene Sendungen ▼";
    });

document.addEventListener("DOMContentLoaded", () => {
    const chatTrigger = document.getElementById("chatTrigger");
    const chatContainer = document.getElementById("chatContainer");

    // Create close button and insert it above chatContainer
    const chatCloseButton = document.createElement("button");
    chatCloseButton.textContent = "X";
    chatCloseButton.classList.add("chat-close-button");
    chatContainer.parentNode.insertBefore(chatCloseButton, chatContainer);

    let isChatOpen = false;

    // Toggle chat visibility
    chatTrigger.addEventListener("click", () => {
        isChatOpen = !isChatOpen;
        chatContainer.classList.toggle("show", isChatOpen);
        chatCloseButton.style.display = isChatOpen ? "block" : "none";
    });

    // Close button to hide chat
    chatCloseButton.addEventListener("click", () => {
        isChatOpen = false;
        chatContainer.classList.remove("show");
        chatCloseButton.style.display = "none";
    });

    // Hide chat and close button initially
    chatContainer.classList.remove("show");
    chatCloseButton.style.display = "none";
});