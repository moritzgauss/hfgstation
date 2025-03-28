document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById('playButton');
    const liveBanner = document.getElementById('liveBanner');
    const toggleHeader = document.getElementById('toggleHeader');
    const showsContainer = document.getElementById('showsContainer');

    let isPlaying = false;

    // Play/Pause Button Logic
    playButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playButton.classList.toggle('playing', isPlaying);
        
        if (isPlaying) {
            liveBanner.style.animation = 'scrollBanner 5s linear infinite';
            liveBanner.classList.remove('hide');
        } else {
            liveBanner.style.animation = 'none';
            liveBanner.classList.add('hide');
        }
    });

    // Shows Container Toggle Logic
    toggleHeader.addEventListener('click', () => {
        showsContainer.classList.toggle('show');
        toggleHeader.textContent = showsContainer.classList.contains('show') 
            ? 'Vergangene Sendungen ▲' 
            : 'Vergangene Sendungen ▼';
    });
});