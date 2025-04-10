document.addEventListener("DOMContentLoaded", async () => {
    const liveBanner = document.getElementById('liveBanner');
    const airtimeContainer = document.getElementById('airtime-player-container');
    
    let isPlaying = false;

    // Function to check if there's a live show and update banner
    async function checkLiveShow() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/live-info');
            const data = await response.json();
            
            // Check if there's a current show playing
            if (data.currentShow && data.currentShow.length > 0) {
                const currentShow = data.currentShow[0];
                const now = new Date();
                const startTime = new Date(currentShow.starts);
                const endTime = new Date(currentShow.ends);
                
                // If we're between start and end time of a show
                if (now >= startTime && now <= endTime) {
                    liveBanner.classList.add('show');
                    const contents = document.querySelectorAll('.marquee-content');
                    contents.forEach(content => {
                        content.style.animation = 'none';
                        content.offsetHeight; // Trigger reflow
                        content.style.animation = 'marquee 15s linear infinite';
                    });
                    isPlaying = true;
                } else {
                    liveBanner.classList.remove('show');
                    const contents = document.querySelectorAll('.marquee-content');
                    contents.forEach(content => {
                        content.style.animation = 'none';
                    });
                    isPlaying = false;
                }
            } else {
                liveBanner.classList.remove('show');
                const contents = document.querySelectorAll('.marquee-content');
                contents.forEach(content => {
                    content.style.animation = 'none';
                });
                isPlaying = false;
            }
        } catch (error) {
            console.error('Failed to fetch live show info:', error);
        }
    }

    // Check for live show every 30 seconds
    setInterval(checkLiveShow, 30000);
    checkLiveShow(); // Initial check

    // Clock functionality
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clockText').textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Track info fetching
    async function updateTrackInfo() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/live-info');
            const data = await response.json();
            
            if (data.current) {
                const currentTrack = `${data.current.name || ''} ${data.current.title || ''}`.trim();
                nowPlayingText.textContent = currentTrack || 'No track information';
            }
            
            if (data.next) {
                const nextTrack = `${data.next.name || ''} ${data.next.title || ''}`.trim();
                nextUpText.textContent = nextTrack || 'No upcoming track information';
            }
        } catch (error) {
            console.error('Failed to fetch track info:', error);
        }
    }

    // Update track info every 30 seconds
    setInterval(updateTrackInfo, 30000);
    updateTrackInfo();

    // Shows Container Toggle Logic
    const toggleHeader = document.getElementById('toggleHeader');
    const showsContainer = document.getElementById('showsContainer');
    
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

    chatWrapper.style.display = 'none';
    
    chatTrigger.addEventListener('click', function() {
        chatWrapper.style.display = 'block';
        chatTrigger.style.display = 'none';
        chatClose.style.display = 'block';
    });

    chatClose.addEventListener('click', function() {
        chatWrapper.style.display = 'none';
        chatTrigger.style.display = 'block';
        chatClose.style.display = 'none';
    });

    // Calendar Toggle Logic
    const toggleCalendar = document.getElementById('toggleCalendar');
    const calendarContainer = document.getElementById('calendarContainer');

    toggleCalendar.addEventListener('click', () => {
        calendarContainer.classList.toggle('show');
        const headerText = toggleCalendar.querySelector('text');
        headerText.textContent = calendarContainer.classList.contains('show') 
            ? 'UPCOMING SHOWS ▲' 
            : 'UPCOMING SHOWS ▼';
    });

    // Function to fetch and display show schedules
    async function updateShowSchedules() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/week-info');
            const data = await response.json();
            
            const calendarContent = document.getElementById('calendarContent');
            calendarContent.innerHTML = ''; // Clear existing content
            
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const today = new Date().getDay();
            
            // Process next 7 days of shows
            let showsFound = 0;
            for (let i = 0; i < 7; i++) {
                const dayIndex = (today + i - 1) % 7;
                const dayName = days[dayIndex];
                const shows = data[dayName] || [];
                
                shows.forEach(show => {
                    const startTime = new Date(show.starts);
                    const endTime = new Date(show.ends);
                    
                    const showElement = document.createElement('div');
                    showElement.className = 'calendar-item';
                    showElement.innerHTML = `
                        <div class="calendar-time">
                            ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div class="calendar-details">
                            <h3>${show.name}</h3>
                            <p>${show.description || 'No description available'}</p>
                        </div>
                    `;
                    
                    calendarContent.appendChild(showElement);
                    showsFound++;
                });
            }
            
            if (showsFound === 0) {
                calendarContent.innerHTML = '<p>No upcoming shows scheduled</p>';
            }
        } catch (error) {
            console.error('Failed to fetch show schedules:', error);
        }
    }

    // Update show schedules every 5 minutes
    setInterval(updateShowSchedules, 300000);
    updateShowSchedules();
});