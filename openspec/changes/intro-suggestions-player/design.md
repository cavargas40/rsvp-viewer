## Context

Currently, the RSVP Viewer's Webview UI loads into a default state that displays the static word "Ready" and shows active player controls and progress indicators even when no content is loaded. This is not intuitive for a new user. The proposal introduces an intro welcome screen with dynamic suggestions on how to trigger the RSVP Viewer.

## Goals / Non-Goals

**Goals:**
- Implement a stunning, glassmorphic welcome/intro view inside the Webview when no document/selection has been parsed yet.
- Display clear step-by-step instructions on how to use the extension, highlighting keyboard shortcuts (`Ctrl+Shift+P` / `Cmd+Shift+P` depending on user's OS) and editor commands.
- Transition automatically to the normal player display as soon as the webview receives a message to load a word stream.
- Ensure the user interface aligns with the existing VS Code theme, maintaining high visual excellence.

**Non-Goals:**
- Adding settings to disable the welcome screen.
- Changing the parsing or document processing logic.

## Decisions

### 1. Welcome Screen UI Layout
We will place a new container `<div class="intro-container" id="introContainer">` inside `player.html`.
- When active, `introContainer` will be shown, while `.viewer-box` (orp guides/display), `.player-header` (progress percentage/time), and `.player-controls` (buttons/slider) will be hidden (using `.hidden`).
- This simplifies the UI and prevents visual clutter from inactive controls.
- The welcome screen instructions will contain keyboard shortcut hints. A placeholder `<span id="cmdShortcut">Ctrl + Shift + P</span>` will be used within a `<kbd>` style wrapper.

### 2. Styling and Glassmorphism
The welcome screen will feature:
- Clean SVG reader icon.
- Gradient typography for the title.
- Styled keyboard keycaps using `<kbd>` tags.
- Detailed step-by-step layout using simple flexbox/grid.

### 3. State Management in `player.js`
- Define a function `togglePlayerMode(hasContent)`:
  - If `hasContent` is `false`, add `.hidden` to `.viewer-box`, `.player-header`, and `.player-controls`, and remove `.hidden` from `introContainer`.
  - If `hasContent` is `true`, reverse the classes.
- Call `togglePlayerMode(false)` in the initialization if `words.length === 0`.
- Call `togglePlayerMode(true)` in the `'load'` message event listener when a non-empty array of words is loaded.

### 4. Client-side OS Recognition
- In `player.js` initialization, detect the operating system:
  ```javascript
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
  const shortcutText = isMac ? 'Cmd + Shift + P' : 'Ctrl + Shift + P';
  const cmdShortcutEl = document.getElementById('cmdShortcut');
  if (cmdShortcutEl) {
    cmdShortcutEl.textContent = shortcutText;
  }
  ```
- This ensures the UI automatically aligns with the user's host environment.

## Risks / Trade-offs

- **[Risk] Webview height on smaller displays (e.g., Sidebar)**: The sidebar view can be narrow or short.
  - *Mitigation*: Design the intro instructions to be concise, utilizing vertical stack on narrow views and using compact font sizes, ensuring no vertical scrollbars appear on standard layouts.
