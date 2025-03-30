document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById('playButton');
    const liveBanner = document.getElementById('liveBanner');
    const marquee = document.querySelector('.marquee');
    const toggleHeader = document.getElementById('toggleHeader');
    const showsContainer = document.getElementById('showsContainer');
    const iframe = document.getElementById('embed_player');
    const nowPlayingText = document.getElementById('nowPlayingText');
    const nextUpText = document.getElementById('nextUpText');

    let isPlaying = false;

    // Function to control iframe player
    function togglePlay() {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow && iframeWindow.postMessage) {
            const message = {
                action: !isPlaying ? 'play' : 'pause',  // Fixed logic here
                source: 'website'
            };
            iframeWindow.postMessage(JSON.stringify(message), '*');  // Changed target origin
        }
    }

    playButton.addEventListener('click', () => {
        togglePlay();  // Call toggle first
        isPlaying = !isPlaying;  // Then update state
        playButton.classList.toggle('playing');
        
        if (isPlaying) {
            liveBanner.classList.add('show');
            const contents = document.querySelectorAll('.marquee-content');
            contents.forEach(content => {
                content.style.animation = 'none';
                content.offsetHeight; // Trigger reflow
                content.style.animation = 'marquee 15s linear infinite';
            });
        } else {
            liveBanner.classList.remove('show');
        }
    });

    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
        if (event.origin === 'https://hfgradio.airtime.pro') {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'metadata') {
                    // Update now playing
                    if (data.current) {
                        nowPlayingText.textContent = data.current.name;
                    }
                    // Update next up
                    if (data.next) {
                        nextUpText.textContent = data.next.name;
                    }
                }
            } catch (e) {
                console.error('Error parsing player message:', e);
            }
        }
    });

    // Shows Container Toggle Logic
    toggleHeader.addEventListener('click', () => {
        showsContainer.classList.toggle('show');
        const headerText = toggleHeader.querySelector('text');
        headerText.textContent = showsContainer.classList.contains('show') 
            ? 'LAST SHOWS ▲' 
            : 'LAST SHOWS ▼';
    });

    // Chat functionality
    const chatTrigger = document.getElementById('chatTrigger');
    const chatClose = document.getElementById('chatClose');
    const chatWrapper = document.getElementById('chatWrapper');

    chatTrigger.addEventListener('click', function() {
        chatWrapper.style.display = 'none';
        chatTrigger.style.display = 'block';
        chatClose.style.display = 'none';
    });

    chatClose.addEventListener('click', function() {
        chatWrapper.style.display = 'none';
        chatTrigger.style.display = 'block';
        chatClose.style.display = 'none';
    });
});