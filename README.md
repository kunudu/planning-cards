# Planning Cards

A lightweight, mobile-first poker planning (planning poker) tool designed for agile teams. Pick an estimate card on your device and hold it up for the team to see.

Zero dependencies, no build step, instantly loads, and works completely offline.

## Features

- **Fibonacci Deck**: `1, 2, 3, 5, 8, 13, 21, ?`
- **Distraction-Free**: The selected card takes over the entire screen with enormous, highly legible typography so it can be read from across a meeting room.
- **PWA / Offline Ready**: Add it to your home screen. A Service Worker caches all assets, meaning the app works flawlessly without an internet connection.
- **Dark Mode Support**: Automatically switches between a warm Slate & Amber light mode and a high-contrast dark mode based on your system preferences.
- **Keyboard Friendly**: Navigate the card grid using the arrow keys, select with `Enter`, and return to the grid with `Escape`.

## Tech Stack

This project deliberately avoids modern JavaScript frameworks in favour of the raw web platform:
- **Vanilla HTML / CSS / JS**
- **Hash-based Routing**: No server required. The browser's native `history.back()` powers navigation between the selection grid and the full-screen card.
- **CSS Grid & Flexbox**: Fluid, responsive layout that scales cards beautifully from small mobile phones to wide desktop displays.
- **CSS Custom Properties**: Design tokens for easy theming.

## Development

There is no build process. To develop locally, simply serve the root directory with any static HTTP server.

For example, using Python:
```bash
python3 -m http.server 8000
```
Or using Node.js (`serve`):
```bash
npx serve .
```
Then open `http://localhost:8000` (or the provided port) in your browser.

## Project Structure

```text
planning-cards/
├── index.html        # App shell (handles both selection and full-screen views)
├── style.css         # All styles, design tokens, and CSS animations
├── app.js            # Routing, DOM generation, and event handling
├── manifest.json     # PWA configuration
├── sw.js             # Service Worker for offline caching
├── logo.svg          # Master SVG logo
└── icons/            # Generated PNGs for PWA installation
```

## Deployment

Because this is a purely static app, you can host it anywhere for free. 
**GitHub Pages**, **Netlify**, **Vercel**, or **Cloudflare Pages** are all excellent options.

Simply configure your host to point to the root directory. Ensure the app is served over HTTPS, as this is a strict requirement for Service Workers to function.
