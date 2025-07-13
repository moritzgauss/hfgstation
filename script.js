document.addEventListener("DOMContentLoaded", async () => {
    const liveBanner = document.getElementById('liveBanner');
    const airtimeContainer = document.getElementById('airtime-player-container');
    const offlineNotification = document.getElementById('offlineNotification');

    offlineNotification.style.display = 'none';
    let isPlaying = false;

    async function checkLiveShow() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/live-info');
            const data = await response.json();

            if (data.currentShow && data.currentShow.length > 0) {
                const currentShow = data.currentShow[0];
                const now = new Date();
                const startTime = new Date(currentShow.starts);
                const endTime = new Date(currentShow.ends);

                if (now >= startTime && now <= endTime) {
                    liveBanner.classList.add('show');
                    offlineNotification.classList.remove('show');

                    const marquees = document.querySelectorAll('.marquee-content');
                    marquees.forEach(content => {
                        content.style.animation = '';
                    });

                    const currentShowTitle = document.getElementById('currentShowTitle');
                    const currentShowImage = document.getElementById('currentShowImage');

                    currentShowTitle.textContent = currentShow.name || 'Untitled Show';

                    currentShowImage.src = `/api/show-logo?id=${currentShow.id}`;
                    currentShowImage.onerror = () => {
                        currentShowImage.src = '/icon.png';
                    };

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

        const marquees = document.querySelectorAll('.marquee-content');
        marquees.forEach(content => {
            content.style.animation = 'none';
        });

        isPlaying = false;
    }

    offlineNotification.addEventListener('click', () => {
        offlineNotification.classList.add('hide');
        offlineNotification.classList.remove('show');

        const showsSection = document.getElementById('showsContainer');
        const showsHeader = document.getElementById('toggleHeader');

        showsContainer.classList.add('show');
        showsHeader.querySelector('text').textContent = 'ARCHIVE ▲';

        setTimeout(() => {
            showsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });

    setInterval(checkLiveShow, 30000);
    checkLiveShow();

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clockText').textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

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

    setInterval(updateTrackInfo, 30000);
    updateTrackInfo();

    const toggleHeader = document.getElementById('toggleHeader');
    const showsContainer = document.getElementById('showsContainer');

    toggleHeader.addEventListener('click', () => {
        showsContainer.classList.toggle('show');
        const headerText = toggleHeader.querySelector('text');
        headerText.textContent = showsContainer.classList.contains('show')
            ? 'ARCHIVE ▲'
            : 'ARCHIVE ▼';
    });

    const mobileChatButton = document.getElementById('mobileChatButton');
    if (mobileChatButton) {
        mobileChatButton.addEventListener('click', () => {
            window.open('https://chatango.com/box?hfgstation', '_blank');
        });
    }

    const toggleCalendar = document.getElementById('toggleCalendar');
    const calendarContainer = document.getElementById('calendarContainer');

    toggleCalendar.addEventListener('click', () => {
        calendarContainer.classList.toggle('show');
        const headerText = toggleCalendar.querySelector('text');
        headerText.textContent = calendarContainer.classList.contains('show')
            ? 'UPCOMING SHOWS ▲'
            : 'UPCOMING SHOWS ▼';

        if (!calendarContainer.classList.contains('show')) {
            const flippedCards = calendarContainer.querySelectorAll('.show-inner');
            flippedCards.forEach(card => {
                card.style.transform = 'rotateY(0)';
            });
        }
    });

    async function updateShowSchedules() {
        try {
            const response = await fetch('https://hfgradio.airtime.pro/api/week-info');
            const data = await response.json();

            const calendarContent = document.getElementById('calendarContent');
            calendarContent.innerHTML = '';

            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let showsFound = 0;

            if (data && typeof data === 'object') {
                Object.entries(data).forEach(([dayName, shows]) => {
                    if (Array.isArray(shows)) {
                        shows.forEach(show => {
                            const startTime = new Date(show.starts);
                            if (startTime > now) {
                                const showElement = document.createElement('div');
                                showElement.className = 'calendar-item';

                                const showDate = new Date(show.starts);
                                const showDay = showDate.getDay();

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

    setInterval(updateShowSchedules, 300000);
    updateShowSchedules();
});