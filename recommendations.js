// DOM Elements
const recommendationForm = document.getElementById('recommendation-form');
const recommendationsList = document.getElementById('recommendations-list');
const recTypeSelect = document.getElementById('rec-type');
const recTitleInput = document.getElementById('rec-title');
const recArtistInput = document.getElementById('rec-artist');
const recDescriptionTextarea = document.getElementById('rec-description');
const recLinkInput = document.getElementById('rec-link');

// Load recommendations on page load
document.addEventListener('DOMContentLoaded', loadRecommendations);

// Handle form submission
recommendationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addRecommendation();
});

// Add new recommendation
function addRecommendation() {
    const type = recTypeSelect.value;
    const title = recTitleInput.value.trim();
    const artist = recArtistInput.value.trim();
    const description = recDescriptionTextarea.value.trim();
    const link = recLinkInput.value.trim();

    if (!type || !title) {
        alert('Please fill in at least the type and title fields.');
        return;
    }

    const recommendation = {
        id: Date.now().toString(),
        type,
        title,
        artist,
        description,
        link,
        dateAdded: new Date().toISOString()
    };

    // Get existing recommendations
    const recommendations = getRecommendations();

    // Add new recommendation
    recommendations.unshift(recommendation);

    // Save to localStorage
    saveRecommendations(recommendations);

    // Clear form
    recommendationForm.reset();

    // Reload display
    displayRecommendations(recommendations);
}

// Get recommendations from localStorage
function getRecommendations() {
    const recommendations = localStorage.getItem('music-recommendations');
    return recommendations ? JSON.parse(recommendations) : [];
}

// Save recommendations to localStorage
function saveRecommendations(recommendations) {
    localStorage.setItem('music-recommendations', JSON.stringify(recommendations));
}

// Load and display recommendations
function loadRecommendations() {
    const recommendations = getRecommendations();
    displayRecommendations(recommendations);
}

// Display recommendations
function displayRecommendations(recommendations) {
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<p class="no-recommendations">No recommendations yet. Add your first one above!</p>';
        return;
    }

    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card" data-id="${rec.id}">
            <span class="rec-type">${rec.type}</span>
            <h3 class="rec-title">${escapeHtml(rec.title)}</h3>
            ${rec.artist ? `<p class="rec-artist">by ${escapeHtml(rec.artist)}</p>` : ''}
            ${rec.description ? `<p class="rec-description">${escapeHtml(rec.description)}</p>` : ''}
            ${rec.link ? `<a href="${escapeHtml(rec.link)}" target="_blank" class="rec-link">🔗 Listen/View</a>` : ''}
            <div class="rec-actions">
                <button onclick="deleteRecommendation('${rec.id}')" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete recommendation
function deleteRecommendation(id) {
    if (confirm('Are you sure you want to delete this recommendation?')) {
        const recommendations = getRecommendations();
        const filteredRecommendations = recommendations.filter(rec => rec.id !== id);
        saveRecommendations(filteredRecommendations);
        displayRecommendations(filteredRecommendations);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}