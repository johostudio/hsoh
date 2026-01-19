# HSOH - My Music Home 🎵

A modern portfolio website for showcasing music platforms, embedded videos, and Last.fm statistics with a beautiful, responsive design.

## Features

- 🎵 **Music Platform Links** - Easy access to Spotify, Apple Music, SoundCloud, YouTube, and Last.fm
- 🎬 **Video Showcase** - Embedded YouTube videos in a responsive grid layout
- 📊 **Last.fm Stats Integration** - Real-time statistics scraper displaying:
  - Total scrobbles, artists, tracks, and albums
  - Top artists (7-day period)
  - Top tracks (7-day period)
  - Recently played tracks
  - User profile information
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/johostudio/hsoh.git
   cd hsoh
   ```

2. **Open the website**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```
   - Then visit `http://localhost:8000`

## Configuration

### Last.fm API Setup

To enable Last.fm statistics, you need to get a free API key:

1. **Get a Last.fm API Key**
   - Visit [Last.fm API Account Creation](https://www.last.fm/api/account/create)
   - Sign in or create a Last.fm account
   - Fill in the application form (you can use any name and description)
   - Copy your API Key

2. **Add Your API Key**
   - Open `script.js`
   - Find line 2: `const LASTFM_API_KEY = 'YOUR_API_KEY_HERE';`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key
   - Save the file

3. **Use the Stats Feature**
   - Enter your Last.fm username in the input field
   - Click "Load Stats"
   - Your statistics will be displayed and saved for future visits

### Customize Music Platform Links

Edit `index.html` to update the platform links with your own profiles:

```html
<!-- Find this section and update the href attributes -->
<a href="YOUR_SPOTIFY_URL" target="_blank" class="platform-btn spotify">
<a href="YOUR_APPLE_MUSIC_URL" target="_blank" class="platform-btn apple-music">
<a href="YOUR_SOUNDCLOUD_URL" target="_blank" class="platform-btn soundcloud">
<a href="YOUR_YOUTUBE_URL" target="_blank" class="platform-btn youtube">
<a href="YOUR_LASTFM_URL" target="_blank" class="platform-btn lastfm">
```

### Add Your Videos

To showcase your own videos, edit `index.html`:

```html
<!-- Find the video-grid section and replace the YouTube embed URLs -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...></iframe>
```

To get a YouTube video embed URL:
1. Go to your YouTube video
2. Click "Share" → "Embed"
3. Copy the URL from the `src` attribute
4. Paste it in the iframe's `src` attribute

## File Structure

```
hsoh/
├── index.html      # Main HTML structure
├── style.css       # All styling and responsive design
├── script.js       # Last.fm API integration and interactions
└── README.md       # This file
```

## Customization Guide

### Change Color Scheme

Edit `style.css` to change the gradient colors:

```css
/* Main gradient background */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header text gradient */
header h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Modify Layout

- Grid layouts use CSS Grid and are fully responsive
- Adjust breakpoints in the `@media` queries at the bottom of `style.css`
- Change grid columns by modifying `grid-template-columns` properties

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

- The website stores your Last.fm username in browser localStorage for convenience
- No data is sent to any server except Last.fm's public API
- All processing happens in your browser

## License

This project is open source and available under the MIT License.

## Credits

Built with ❤️ by HSOH using:
- Last.fm API for music statistics
- Pure HTML, CSS, and JavaScript (no frameworks needed!)

## Support

If you encounter any issues or have questions:
1. Make sure you've added your Last.fm API key to `script.js`
2. Check browser console for error messages
3. Ensure your Last.fm username is correct
4. Verify your internet connection

---

Enjoy your music home! 🎵
