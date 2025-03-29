document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    const liveBanner = document.getElementById("liveBanner");
    const marquee = document.querySelector(".marquee");
    const toggleHeader = document.getElementById("toggleHeader");
    const showsContainer = document.getElementById("showsContainer");
    const chatDiv = document.querySelector(".chat");

    let isPlaying = false;

    // Play/Pause Button Logic
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

    // Shows Container Toggle Logic
    toggleHeader.addEventListener("click", () => {
        showsContainer.classList.toggle("show");
        toggleHeader.textContent = showsContainer.classList.contains("show")
            ? "Vergangene Sendungen ▲"
            : "Vergangene Sendungen ▼";
    });

document.addEventListener("DOMContentLoaded", () => {
    const chatTrigger = document.getElementById("chatTrigger");
    const chatContainer = document.getElementById("chatContainer");
    const chatTriggerText = document.getElementById("chatTriggerText");

    chatTrigger.addEventListener("click", () => {
        const isChatOpen = chatContainer.style.display === "block";

        // Toggle chat visibility
        chatContainer.style.display = isChatOpen ? "none" : "block";

        // Change the text in the trigger
        chatTriggerText.textContent = isChatOpen ? "CHAT" : "CLOSE";
    });
});