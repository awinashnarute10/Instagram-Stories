# Instagram Stories Clone

A faithful recreation of the Instagram Stories feature, built entirely from scratch with  React and CSS, prioritizing mobile-first aesthetics and performance.

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (CSS-first approach with `@import "tailwindcss"`)
- **Language:** Plain JavaScript (No TypeScript)
- **External Libraries:** None (Zero dependencies beyond React & Tailwind)

## How to Run
```bash
npm install
npm run dev
```

> **IMPORTANT:** This application is built **strictly for mobile**. 
> Please test using Chrome DevTools with the Device Toolbar toggled on, set to a mobile viewport like **390x844** (iPhone 12/13/14). If opened on desktop, you will see a "Mobile only" fallback screen.

## Features & Requirements Mapping
- **Mobile Only Shell:** A responsive wrapper that hides the app on desktop viewports and forces a dark-theme, mobile-optimized experience.
- **Data Source:** Fetches data lazily from `public/stories.json` using a custom `useStories` hook with abort controllers and error handling.
- **Story Tray:** Horizontal scrolling list of users. Avatars sport the iconic Instagram gradient ring which turns gray once every single one of their stories has been viewed.
- **Fullscreen Viewer:** A highly immersive `100dvh` fixed overlay with fade-in and scale animations, featuring CSS-only transitions.
- **Gestures & Navigation:** 
  - Tapping the left/right edges (30% / 70% zones) navigates stories.
  - Tapping an avatar intelligently opens at the *first unseen story*.
  - Holding down pauses the timer and fades out the UI chrome.
  - Swiping down closes the viewer with a dynamic spring-back animation.
- **Precision Timer:** A highly optimized `requestAnimationFrame` timer loop that accurately tracks elapsed time independent of frame rate or pauses.
- **Preloading & Loading Gate:** The 5-second timer is perfectly synchronized with image visibility—it waits for the image to load. Next/previous stories are aggressively pre-loaded in the background for instant navigation.

## Data Structure (`public/stories.json`)
The application fetches stories from a static JSON file. To add users or stories, update `public/stories.json` with the following shape:

```json
[
  {
    "id": "u1",
    "username": "awinash",
    "avatar": "https://picsum.photos/seed/awinash-av/160/160",
    "stories": [
      {
        "id": "u1-s1",
        "image": "https://picsum.photos/seed/aw-1/1080/1920",
        "postedAt": "2h"
      }
    ]
  }
]
```
*Note: Ensure images are high resolution (1080x1920 recommended) for the best full-screen experience.*

## How It Works

### The `requestAnimationFrame` Timer
Instead of relying on `setInterval` (which is imprecise and drifts) or CSS transitions (which can't be perfectly paused and resumed without DOM hacks), the progress bars are driven by a custom `useStoryTimer` hook. It uses `performance.now()` in a `requestAnimationFrame` loop, tracking the exact time delta. When you hold down to pause, the timer seamlessly halts, and resumes precisely where it left off upon release. 

### The Loading Gate
The timer loop is strictly gated by image load status. `useImagePreload` uses a raw `Image` object to verify when the current story's image has successfully downloaded. The progress bar stays at `0%` and a spinner is shown until `loaded === true`, guaranteeing the user gets exactly 5 seconds of viewing time regardless of network speed.

### Cross-Boundary Navigation
State is centrally managed in `App.jsx`, tracking both the currently active viewer coordinates (`{userIndex, storyIndex}`) and a Set of `seenStoryIds`. 
- Navigating `Next` seamlessly advances the `storyIndex`, and upon reaching the end of a user's array, immediately skips to the next user's index 0.
- Navigating `Prev` traverses backwards, catching the last story of the previous user.
- These coordinate changes flow down to `StoryViewer`, triggering instantaneous background cross-fades between the preloaded images.