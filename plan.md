# Planning Cards — UI/UX Upgrade Plan

This document outlines the step-by-step implementation plan for upgrading the visual polish and tactile user experience of the Planning Cards app.

## Goals
Transform the app from a "digital interface" into something that feels like a physical, tactile deck of cards when used in a meeting room.

---

## Phase 1: Typography & Physical Aesthetics
**Objective:** Make the cards look like beautifully printed physical objects.

1. **Custom Typography**
   - Import a modern, highly legible geometric font (e.g., *Outfit* or *Inter*) from Google Fonts.
   - Apply it specifically to the `.card__value` and `.pip` elements so the numbers have distinct character.
2. **Physical Card Styling**
   - Add a subtle CSS radial gradient to `.card` backgrounds to simulate lighting.
   - Add an inner `box-shadow` to simulate the slight raised edge of a printed card.
3. **Instructional Footer**
   - Add a subtle `<footer>` below the `.card-grid` with text like: *"Tap a card to select your estimate"*.
   - Style it with `--text-muted` and a small font size so it doesn't distract.

---

## Phase 2: "Tap Anywhere" Dismissal
**Objective:** Remove visual clutter and make the full-screen card immersive.

1. **Remove the Header**
   - Delete the `<header class="card-header">` and the Back button from `index.html`.
2. **Click-to-Dismiss**
   - In `app.js`, add a click event listener directly to `#view-card` that calls `history.back()`.
3. **Accessibility (A11y)**
   - Ensure the `#view-card` overlay is announced correctly to screen readers.
   - Ensure keyboard users can still dismiss it using the `Escape` key (which is already implemented).

---

## Phase 3: Swipe-to-Dismiss Gesture
**Objective:** Support native-feeling mobile gestures.

1. **Touch State Tracking**
   - Add variables in `app.js` to track `startY` and `currentY`.
2. **Touch Listeners**
   - `touchstart`: Record the initial Y position.
   - `touchmove`: Calculate the downward drag distance (`deltaY`). Apply a real-time inline CSS `transform: translateY(...)` and `opacity` to the card so it visually follows the user's thumb.
   - `touchend`: Check the final drag distance.
     - If dragged down > 100px: Trigger `history.back()`.
     - If < 100px: Snap the card back to its original position using a spring-like CSS transition.

---

## Phase 4: 3D Flip Animation
**Objective:** Simulate turning a physical card over when revealing an estimate.

1. **CSS Perspective**
   - Apply `perspective: 1000px` to the `body` or a new main wrapper.
2. **Transition Logic**
   - Modify the view toggling in `style.css` and `app.js`.
   - Instead of just fading opacity and scaling, add `rotateY()` transforms.
   - **Flip In (Grid → Full-screen):** The grid rotates out (-90deg on Y axis), and the full-screen card rotates in (from 90deg to 0deg).
   - **Flip Out (Full-screen → Grid):** The full-screen card rotates out (90deg), and the grid rotates back in (from -90deg to 0).
3. **Respect Reduced Motion**
   - Ensure the 3D flip is wrapped in `@media (prefers-reduced-motion: no-preference)`. If the user prefers reduced motion, it gracefully falls back to the current simple fade.

---

## Questions to decide on

Before we start, let's confirm a few minor details:
1. **Font Choice:** I am planning to use **Outfit** (a clean, geometric sans-serif that looks great for numbers). Does that sound good, or do you prefer something else?
2. **Desktop Back Navigation:** With the back button gone, desktop users will have to click the card to go back. Is that intuitive enough, or should we show a subtle "×" close icon *only* on non-touch devices?