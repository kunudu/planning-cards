# Project Context for AI Assistants

This document contains key technical details and architectural decisions for AI coding assistants working on this project.

## Architecture & Stack
- **Tech Stack**: Vanilla HTML, CSS, JavaScript (zero-dependency).
- **Features**: Progressive Web App (PWA) with hash-based routing.
- **Styling & Assets**: Built with CSS custom properties ("Slate & Amber" theme). Uses raw SVG code for icons and logos.
- **UI Details**: Features complex physical card simulations, including radial gradients and inner box-shadows (for card edge thickness).

## Key Implementations & Gotchas
- **Touch Gestures**: Dismissing cards relies on a custom JS touch-gesture engine (tracking `touchstart`, `touchmove`, `touchend`). A 120px threshold triggers a fluid swipe-to-dismiss mapped to CSS transforms.
- **Animations**: Uses staggered "deal-in" CSS animations and CSS 3D transforms for physical card flipping.
- **WebKit CSS Bug / Perspective**: **Do not** apply `perspective: 1200px` to the `body` tag. Doing so alters the containing block for fixed descendants, causing full-screen `position: fixed` elements to be cut off during scrolling on WebKit. Apply the `perspective` property directly to the fixed wrapper instead.
