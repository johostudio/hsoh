// Last.fm API Configuration
const LASTFM_API_KEY = 'cd1214f227b0a1abd53367407947e7ab'; // Last.fm API key for stats functionality
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

// DOM Elements
const usernameInput = document.getElementById('lastfm-username');
const loadStatsBtn = document.getElementById('load-stats-btn');
const statsContainer = document.getElementById('stats-container');
const errorMessage = document.getElementById('error-message');

// Stats Elements
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userPlaycount = document.getElementById('user-playcount');
const totalScrobbles = document.getElementById('total-scrobbles');
const totalArtists = document.getElementById('total-artists');
const totalTracks = document.getElementById('total-tracks');
const totalAlbums = document.getElementById('total-albums');
const topArtistsContainer = document.getElementById('top-artists');
const topTracksContainer = document.getElementById('top-tracks');
const recentTracksContainer = document.getElementById('recent-tracks');

// Event Listeners
loadStatsBtn.addEventListener('click', loadLastFmStats);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadLastFmStats();
    }
});

// Auto-load stats for default username on page load
window.addEventListener('DOMContentLoaded', () => {
    const defaultUsername = 'hosshh';
    usernameInput.value = defaultUsername;
    loadLastFmStats();
});

// Main function to load Last.fm stats
async function loadLastFmStats() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Please enter a Last.fm username');
        return;
    }

    // Validate API key
    if (LASTFM_API_KEY === 'YOUR_API_KEY_HERE' || !LASTFM_API_KEY) {
        showError('Please add your Last.fm API key to script.js. Get one free at https://www.last.fm/api/account/create');
        return;
    }

    // Save username to localStorage
    localStorage.setItem('lastfm-username', username);

    // Show loading state
    loadStatsBtn.textContent = 'Loading...';
    loadStatsBtn.disabled = true;
    hideError();

    try {
        // Fetch all data in parallel
        const [userInfo, topArtists, topTracks, recentTracks, topAlbums] = await Promise.all([
            fetchLastFmData('user.getInfo', { user: username }),
            fetchLastFmData('user.getTopArtists', { user: username, period: '7day', limit: 5 }),
            fetchLastFmData('user.getTopTracks', { user: username, period: '7day', limit: 5 }),
            fetchLastFmData('user.getRecentTracks', { user: username, limit: 5 }),
            fetchLastFmData('user.getTopAlbums', { user: username, period: 'overall', limit: 1 })
        ]);

        // Display user info
        displayUserInfo(userInfo.user);

        // Display stats
        displayStats(userInfo.user);

        // Display top artists
        displayTopArtists(topArtists.topartists?.artist || []);

        // Display top tracks
        displayTopTracks(topTracks.toptracks?.track || []);

        // Display recent tracks
        displayRecentTracks(recentTracks.recenttracks?.track || []);

        // Show stats container
        statsContainer.classList.remove('stats-hidden');

    } catch (error) {
        console.error('Error fetching Last.fm data:', error);
        showError('Failed to load Last.fm stats. Please check the username and try again.');
    } finally {
        loadStatsBtn.textContent = 'Load Stats';
        loadStatsBtn.disabled = false;
    }
}

// Fetch data from Last.fm API
async function fetchLastFmData(method, params = {}) {
    const url = new URL(LASTFM_API_URL);
    url.searchParams.append('method', method);
    url.searchParams.append('api_key', LASTFM_API_KEY);
    url.searchParams.append('format', 'json');
    
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.message || 'Last.fm API error');
    }
    
    return data;
}

// Display user information
function displayUserInfo(user) {
    const avatarUrl = user.image?.find(img => img.size === 'large')?.['#text'] || '';
    userAvatar.src = avatarUrl || 'https://via.placeholder.com/80';
    userName.textContent = user.realname || user.name;
    
    const registeredDate = new Date(parseInt(user.registered.unixtime) * 1000);
    const memberSince = registeredDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    userPlaycount.textContent = `Member since ${memberSince}`;
}

// Display overall stats
function displayStats(user) {
    totalScrobbles.textContent = formatNumber(user.playcount);
    totalArtists.textContent = formatNumber(user.artist_count);
    totalTracks.textContent = formatNumber(user.track_count);
    totalAlbums.textContent = formatNumber(user.album_count);
}

// Display top artists
function displayTopArtists(artists) {
    if (!artists || artists.length === 0) {
        topArtistsContainer.innerHTML = '<p>No top artists found for this period.</p>';
        return;
    }

    topArtistsContainer.innerHTML = artists.map((artist, index) => {
        const imageUrl = artist.image?.find(img => img.size === 'large')?.['#text'] || 'https://via.placeholder.com/60';
        return `
            <div class="top-item">
                <span class="rank">#${index + 1}</span>
                <img src="${imageUrl}" alt="${artist.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="item-info">
                    <div class="item-name">${artist.name}</div>
                    <div class="item-artist">${formatNumber(artist.playcount)} plays</div>
                </div>
            </div>
        `;
    }).join('');
}

// Display top tracks
function displayTopTracks(tracks) {
    if (!tracks || tracks.length === 0) {
        topTracksContainer.innerHTML = '<p>No top tracks found for this period.</p>';
        return;
    }

    topTracksContainer.innerHTML = tracks.map((track, index) => {
        const imageUrl = track.image?.find(img => img.size === 'large')?.['#text'] || 'https://via.placeholder.com/60';
        return `
            <div class="top-item">
                <span class="rank">#${index + 1}</span>
                <img src="${imageUrl}" alt="${track.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="item-info">
                    <div class="item-name">${track.name}</div>
                    <div class="item-artist">${track.artist.name}</div>
                </div>
                <div class="item-playcount">${formatNumber(track.playcount)}</div>
            </div>
        `;
    }).join('');
}

// Display recent tracks
function displayRecentTracks(tracks) {
    if (!tracks || tracks.length === 0) {
        recentTracksContainer.innerHTML = '<p>No recent tracks found.</p>';
        return;
    }

    recentTracksContainer.innerHTML = tracks.map((track, index) => {
        const imageUrl = track.image?.find(img => img.size === 'large')?.['#text'] || 'https://via.placeholder.com/60';
        const isNowPlaying = track['@attr']?.nowplaying === 'true';
        const timeAgo = isNowPlaying ? 'Now Playing' : getTimeAgo(track.date?.uts);
        
        return `
            <div class="top-item">
                <img src="${imageUrl}" alt="${track.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="item-info">
                    <div class="item-name">${track.name}</div>
                    <div class="item-artist">${track.artist['#text'] || track.artist.name}</div>
                </div>
                <div class="item-playcount">${timeAgo}</div>
            </div>
        `;
    }).join('');
}

// Utility function to format numbers with commas
function formatNumber(num) {
    if (!num) return '0';
    return parseInt(num).toLocaleString();
}

// Utility function to get time ago
function getTimeAgo(timestamp) {
    if (!timestamp) return '';
    
    const now = Date.now();
    const then = parseInt(timestamp) * 1000;
    const diff = now - then;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('error-hidden');
    statsContainer.classList.add('stats-hidden');
}

// Hide error message
function hideError() {
    errorMessage.classList.add('error-hidden');
}
