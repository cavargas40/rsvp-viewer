## Context

This project is a new VS Code extension. The goal is to build a high-performance, visually stunning RSVP (Rapid Serial Visual Presentation) reader. Since we are starting from an empty workspace, this design covers the setup of the extension structure, the multi-format document parsing algorithm, the Webview messaging protocol, and the Webview UI design.

## Goals / Non-Goals

**Goals:**
- **Zero-Config Launch**: Instantly read the current file or selection using a keyboard shortcut, Command Palette (`Ctrl + Shift + P`), or context menu item.
- **Support Multiple Formats**: Read Markdown files, plain text files, and source code comment blocks cleanly.
- **Perfect ORP Visual Alignment**: Implement a three-part span alignment system to center every word exactly on its focus character.
- **Punctuation & Syntax-Aware Timing**: Pause naturally on commas, periods, headers, and paragraph breaks.
- **Premium Glassmorphic UI**: Develop a responsive, customizable, and modern dark-mode-first player UI with smooth animations, progress indicator, and settings drawer.
- **VS Code Theme Synchronization**: Automatically adopt editor colors for backgrounds, text, and borders.

**Non-Goals:**
- Support for rendering images, complex mathematical formulas (LaTeX), or interactive tables within the RSVP stream.
- Audio speech synthesis (text-to-speech).

## Decisions

### 1. Extension Architecture & Webview Hosting
- **Decision**: Separate the extension host logic (`extension.ts`, `rsvpPanel.ts`, `documentProcessor.ts`) from the Webview rendering code (HTML, CSS, JS inside a `media` directory).
- **Rationale**: Keeps code modular. The Webview script executes in an isolated context and communicates with the extension via VS Code's `postMessage` API, facilitating simple state updates and settings sync.

### 2. ORP (Optimal Recognition Point) Word Split & CSS Alignment
- **Decision**: Calculate the ORP character index using standard reading research formulas:
  - Length 0-1: Index 0
  - Length 2-5: Index 1
  - Length 6-9: Index 2
  - Length 10-13: Index 3
  - Length > 13: Index 4
- Split the word into three parts: `prefix`, `orp`, and `suffix`.
- **CSS Layout**: Render these inside a container with CSS Grid or absolute position guides:
  ```html
  <div class="word-viewer">
    <div class="word-part prefix">V</div>
    <div class="word-part orp">i</div>
    <div class="word-part suffix">sual</div>
  </div>
  ```
  The `.orp` element is centered in the viewport, `.prefix` aligns to the right of the center line, and `.suffix` aligns to the left of the center line. This keeps the eyes fixed at a single vertical guide.

### 3. Pacing and Delay Mechanics
- **Decision**: Implement the timing queue on the Webview side using a dynamic tick loop.
- **Rationale**: Standard intervals (e.g. `setInterval`) do not support variable delays per word. Using a loop with recursive `setTimeout` allows adjusting the delay for the *current* word dynamically.
- Delays are calculated as:
  - Base interval: `60,000 / WPM` milliseconds.
  - Sentence-ending (`.`, `!`, `?`): `2.0 * Base`.
  - Mid-sentence pause (`,`, `;`, `:`, `-`): `1.5 * Base`.
  - Paragraph boundary/Header transition: `2.5 * Base` (represented by a short empty pause word).

### 4. Lightweight Document Parsing & Comment Stripping
- **Decision**: Implement a regex-based parser (`documentProcessor.ts`) in the extension host to pre-process Markdown, plain text, and code comment blocks into clean tokens.
- **Rationale**: A custom regex processor allows stripping block comment headers/footers and inline line-comment characters (`//`, `#`, `/*`, `*/`) as well as Markdown asterisks/links without needing full AST parsers. This keeps the extension lightweight while giving us complete control over injected meta-tokens for punctuation pacing and pauses.

## Risks / Trade-offs

- **[Risk] High Webview CPU consumption at high speeds** → **Mitigation**: Avoid DOM rewrites for the whole player. Only update the text contents of the three predefined word spans (`.prefix`, `.orp`, `.suffix`) and adjust progress bar width using CSS transitions.
- **[Risk] Code blocks causing unreadable RSVP output** → **Mitigation**: Code blocks will be automatically stripped of syntax, and multi-line block code will be collapsed to a placeholder token `[Code Block]` with a longer pause, allowing users to skim past them.

