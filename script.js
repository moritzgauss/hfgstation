document.addEventListener("DOMContentLoaded", async () => {
    const liveBanner = document.getElementById('liveBanner');
    const airtimeContainer = document.getElementById('airtime-player-container');
    const offlineNotification = document.getElementById('offlineNotification');
    
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
                    offlineNotification.classList.remove('show');
                    const contents = document.querySelectorAll('.marquee-content');
                    contents.forEach(content => {
                        content.style.animation = 'none';
                        content.offsetHeight; // Trigger reflow
                        content.style.animation = 'marquee 15s linear infinite';
                    });
                    isPlaying = true;
                } else {
                    handleOfflineState();
                }
            } else {
                handleOfflineState();
            }
        } catch (error) {
            console.error('Failed to fetch live show info:', error);
            handleOfflineState();
        }
    }

    function handleOfflineState() {
        liveBanner.classList.remove('show');
        offlineNotification.classList.add('show');
        const contents = document.querySelectorAll('.marquee-content');
        contents.forEach(content => {
            content.style.animation = 'none';
        });
        isPlaying = false;
    }

    // Add click handler for notification
    offlineNotification.addEventListener('click', () => {
        offlineNotification.classList.add('hide');
        offlineNotification.classList.remove('show');
        
        const showsSection = document.getElementById('showsContainer');
        const showsHeader = document.getElementById('toggleHeader');
        
        showsContainer.classList.add('show');
        showsHeader.querySelector('text').textContent = 'LAST SHOWS ▲';
        
        // Add small delay before scrolling to ensure animation completes
        setTimeout(() => {
            showsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });

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
            ? 'ARCHIVE ▲' 
            : 'ARCHIVE ▼';
        
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
        
        // Reset all flipped cards when closing the section
        if (!calendarContainer.classList.contains('show')) {
            const flippedCards = calendarContainer.querySelectorAll('.show-inner');
            flippedCards.forEach(card => {
                card.style.transform = 'rotateY(0)';
            });
        }
    });

    // Function to fetch and display show schedules
    async function updateShowSchedules() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/week-info');
            const data = await response.json();
            
            const calendarContent = document.getElementById('calendarContent');
            calendarContent.innerHTML = '';
            
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let showsFound = 0;

            // Check if data exists and is properly structured
            if (data && typeof data === 'object') {
                Object.entries(data).forEach(([dayName, shows]) => {
                    // Check if shows is an array before using forEach
                    if (Array.isArray(shows)) {
                        shows.forEach(show => {
                            const startTime = new Date(show.starts);
                            if (startTime > now) {
                                const showElement = document.createElement('div');
                                showElement.className = 'calendar-item';
                                
                                // Get the day index for display
                                const showDate = new Date(show.starts);
                                const showDay = showDate.getDay();
                                
                                // Extract Instagram handle from description
                                const instagramHandle = show.description?.match(/@([a-zA-Z0-9._]+)/)?.[1];
                                
                                showElement.innerHTML = `
                                    <div class="show-inner">
                                        <div class="show-front">
                                            <div class="calendar-time">
                                                <span class="day">${days[showDay]}</span>
                                                <span class="time">${showDate.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                            <div class="calendar-details">
                                                <h3>${show.name || 'Untitled Show'}</h3>
                                                <p>${show.description || 'No description available'}</p>
                                            </div>
                                        </div>
                                        ${instagramHandle ? `
                                            <div class="show-back">
                                                <button class="back-button"></button>
                                                <iframe 
                                                    src="https://www.instagram.com/${instagramHandle}/embed" 
                                                    frameborder="0" 
                                                    scrolling="no" 
                                                    allowtransparency="true"
                                                    width="100%"
                                                    height="100%">
                                                </iframe>
                                            </div>
                                        ` : ''}
                                    </div>
                                `;

                                if (instagramHandle) {
                                    const showInner = showElement.querySelector('.show-inner');
                                    const backButton = showElement.querySelector('.back-button');
                                    
                                    showElement.addEventListener('click', (e) => {
                                        if (!e.target.classList.contains('back-button')) {
                                            showInner.style.transform = 'rotateY(180deg)';
                                        }
                                    });
                                    
                                    backButton.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        showInner.style.transform = 'rotateY(0)';
                                    });
                                }
                                
                                calendarContent.appendChild(showElement);
                                showsFound++;
                            }
                        });
                    }
                });
            }
            
            if (showsFound === 0) {
                calendarContent.innerHTML = '<p>No upcoming shows scheduled</p>';
            }
        } catch (error) {
            console.error('Failed to fetch show schedules:', error);
            calendarContent.innerHTML = '<p>Failed to load show schedules</p>';
        }
    }

        // Update show schedules every 5 minutes
        setInterval(updateShowSchedules, 300000);
        updateShowSchedules();
    });