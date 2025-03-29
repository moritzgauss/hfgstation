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

    // 💬 Chat Toggle Logic
    chatTrigger.addEventListener("click", () => {
        isChatOpen = !isChatOpen;
        
        if (isChatOpen) {
            chatContainer.style.display = "block";
            chatTriggerText.textContent = "CLOSE";
        } else {
            chatContainer.style.display = "none";
            chatTriggerText.textContent = "CHAT";
        }
    });

    // Chat beim Laden verstecken
    chatContainer.style.display = "none";
});