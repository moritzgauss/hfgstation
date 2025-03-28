document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById('playButton');
    const liveBanner = document.getElementById('liveBanner');
    const toggleHeader = document.getElementById('toggleHeader');
    const showsContainer = document.getElementById('showsContainer');
    
    let isPlaying = false;

    // Play/Pause Button Logic
    playButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playButton.textContent = isPlaying ? '❚❚' : '▶';
        liveBanner.classList.toggle('hide', !isPlaying);
    });

    // Shows Container Toggle Logic
    toggleHeader.addEventListener('click', () => {
        showsContainer.style.display = showsContainer.style.display === 'grid' ? 'none' : 'grid';
        showsContainer.classList.toggle('show');
        toggleHeader.textContent = showsContainer.classList.contains('show') 
            ? 'Vergangene Sendungen ▲' 
            : 'Vergangene Sendungen ▼';
    });
});