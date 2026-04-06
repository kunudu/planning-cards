/* ============================================================
   Planning Cards — app.js
   Phase 5: Routing, render logic, haptics, keyboard, SW registration
   ============================================================ */

'use strict';

// ── Constants ────────────────────────────────────────────────
const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?'];

// ── DOM references ───────────────────────────────────────────
const viewSelect = document.getElementById('view-select');
const viewCard   = document.getElementById('view-card');
const cardGrid   = document.querySelector('.card-grid');
const cardValue  = document.getElementById('card-value');
const pipTl      = document.getElementById('pip-tl');
const pipBr      = document.getElementById('pip-br');
const closeBtn   = document.querySelector('.close-btn');

// ── Build card grid ──────────────────────────────────────────
// Cards are generated in JS to avoid repetition in HTML (task 5.6)
function buildGrid() {
  CARDS.forEach(value => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.dataset.value = value;
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('aria-label', `Estimate: ${value}`);
    btn.innerHTML = `
      <span class="pip pip--tl" aria-hidden="true">${value}</span>
      <span class="card__value" aria-hidden="true">${value}</span>
      <span class="pip pip--br" aria-hidden="true">${value}</span>
    `;
    cardGrid.appendChild(btn);
  });
}

// ── View transitions ─────────────────────────────────────────
// #view-card uses opacity + rotateY + scale for smooth 3D animation.
// JS controls display via pointer-events + opacity; .hidden only
// used as a hard cut when going back to avoid any flash.

let hideTimer = null;

function showCard(value) {
  // Populate content
  cardValue.textContent = value;
  pipTl.textContent     = value;
  pipBr.textContent     = value;
  document.title        = `Planning Cards — ${value}`;

  // Reset any touch gesture transforms
  viewCard.style.transform = '';
  viewCard.style.opacity = '';
  viewCard.style.transition = '';

  // Cancel any in-progress hide
  clearTimeout(hideTimer);

  // Make overlay participates in layout (remove hard-hidden if set)
  viewCard.classList.remove('hidden');

  // Force a reflow so the browser registers the non-visible state
  // before we add .is-visible to trigger the CSS transition
  void viewCard.offsetWidth;

  viewCard.classList.add('is-visible');
}

function showSelection() {
  document.title = 'Planning Cards';

  // Start fade-out
  viewCard.classList.remove('is-visible');

  // After the transition (220 ms) hard-hide the overlay so it's
  // fully out of the stacking context and screen readers skip it.
  // Fallback timeout is slightly longer than the CSS transition.
  hideTimer = setTimeout(() => {
    viewCard.classList.add('hidden');
  }, 260);
}

// ── Routing ──────────────────────────────────────────────────
function render() {
  const hash  = window.location.hash;           // e.g. "#card=8"
  const match = hash.match(/^#card=(.+)$/);

  if (match) {
    const value = decodeURIComponent(match[1]);
    if (CARDS.includes(value)) {
      showCard(value);
      return;
    }
  }

  showSelection();
}

// ── Events: card selection ───────────────────────────────────
cardGrid.addEventListener('click', e => {
  const card = e.target.closest('[data-value]');
  if (!card) return;

  const value = card.dataset.value;

  // Haptic feedback on mobile (task 5.7)
  navigator.vibrate?.(50);

  // Push new hash — triggers hashchange → render()
  location.hash = 'card=' + encodeURIComponent(value);
});

// ── Events: tap anywhere to dismiss ──────────────────────────
viewCard.addEventListener('click', e => {
  // Clicking anywhere on the full-screen view (or the close btn) goes back
  history.back();
});

// ── Events: swipe down to dismiss ────────────────────────────
let startY = 0;
let currentY = 0;
let isDragging = false;

viewCard.addEventListener('touchstart', e => {
  if (e.touches.length > 1) return; // Only track single touch
  startY = e.touches[0].clientY;
  isDragging = true;
  // Disable CSS transition during manual drag
  viewCard.style.transition = 'none';
}, { passive: true });

viewCard.addEventListener('touchmove', e => {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;
  
  // Only allow dragging downwards
  if (deltaY > 0) {
    viewCard.style.transform = `translateY(${deltaY}px)`;
    viewCard.style.opacity = Math.max(0, 1 - (deltaY / window.innerHeight));
  }
}, { passive: true });

viewCard.addEventListener('touchend', e => {
  if (!isDragging) return;
  isDragging = false;
  
  const deltaY = currentY - startY;
  
  // Restore CSS transition so it snaps back or animates out
  viewCard.style.transition = '';
  
  if (deltaY > 120) {
    // Threshold crossed: dismiss
    history.back();
  } else {
    // Snap back to 0
    viewCard.style.transform = '';
    viewCard.style.opacity = '';
  }
});

// ── Events: keyboard ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  const inCardView = viewCard.classList.contains('is-visible');

  // Escape while viewing a card → go back (task 5.11)
  if (inCardView && e.key === 'Escape') {
    history.back();
    return;
  }

  // Arrow-key navigation on the selection grid (task 5.11)
  if (!inCardView && ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    const cards   = Array.from(cardGrid.querySelectorAll('.card'));
    const focused = document.activeElement;
    let   idx     = cards.indexOf(focused);

    // If nothing is focused yet, focus the first card
    if (idx === -1) {
      cards[0]?.focus();
      return;
    }

    // Work out how many columns the grid currently has
    const firstRect  = cards[0].getBoundingClientRect();
    const secondRect = cards[1]?.getBoundingClientRect();
    const cols = (secondRect && secondRect.top === firstRect.top)
      ? Math.round(cardGrid.offsetWidth / firstRect.width)
      : 1;

    const moves = {
      ArrowRight: 1,
      ArrowLeft:  -1,
      ArrowDown:  cols,
      ArrowUp:    -cols,
    };

    const next = idx + moves[e.key];
    if (next >= 0 && next < cards.length) {
      e.preventDefault();
      cards[next].focus();
    }
  }
});

// ── Hash-change routing ───────────────────────────────────────
window.addEventListener('hashchange', render);

// ── Service Worker registration (task 5.12) ──────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

// ── Boot ─────────────────────────────────────────────────────
buildGrid();
render();
