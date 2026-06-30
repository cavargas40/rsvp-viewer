# RSVP Markdown Reader

An elegant and high-performance VS Code extension designed to speed-read Markdown documentation, plain text, and source code comments using **Rapid Serial Visual Presentation (RSVP)** with an **Optimal Recognition Point (ORP)** centered display.

---

## 🚀 Features

- **Rapid Serial Visual Presentation (RSVP):** Pace through text word-by-word at a speed of your choice to improve reading focus and comprehension.
- **Optimal Recognition Point (ORP) Highlight:** Centered highlight guide highlighting the focus character (typically the single focal letter in each word) so your eye doesn't have to scan.
- **Flexible UI Layouts:**
  - **Activity Bar & Sidebar View (`rsvp-viewer.playerView`):** Pin the RSVP Player to your sidebar or drag it anywhere in your editor layout (e.g., bottom panel, secondary sidebar).
  - **Editor Tab Webview Panel:** Opens as a standalone editor tab when the sidebar view is not active or visible.
- **Smart Document Processing:**
  - Automatically extracts and cleans comment lines in source code (C-style comment markers, Python `#` comments, Shell/YAML/Dockerfile comments).
  - Keeps Markdown list markers prepended to list item words.
  - Automatically skips fenced code blocks and replaces them with a placeholder indicator (`[Code_Block]`).
  - Injects smart timing/pacing delays for punctuation (longer pauses for periods, commas, colons, and headers).
- **Interactive Player Controls:**
  - Play, Pause, Stop, Skip Forward/Backward, and Speed adjustment slider (100 - 1000 WPM).
  - Settings Drawer to customize typography (Font Family, Font Size, and ORP accent colors).

---

## ⌨️ Keyboard Shortcuts

While the RSVP Player is focused, you can control playback entirely using keyboard shortcuts:

| Shortcut | Action |
| --- | --- |
| `Space` | Play / Pause |
| `Left Arrow` | Skip Backward (Word) |
| `Right Arrow` | Skip Forward (Word) |
| `Up Arrow` | Skip Backward (Sentence) |
| `Down Arrow` | Skip Forward (Sentence) |
| `Esc` | Stop & Reset Player / Close Settings Drawer |

---

## ⚙️ Configuration Settings

You can customize the extension using VS Code's settings under the `rsvpReader` namespace:

- `rsvpReader.defaultWpm` (Default: `300`): Default reading speed in Words Per Minute (WPM).
- `rsvpReader.orpColor` (Default: `var(--vscode-editorError-foreground, #ff0000)`): Accent color for the Optimal Recognition Point character highlight.
- `rsvpReader.fontSize` (Default: `28`): Default font size for the RSVP Viewer text in pixels.
- `rsvpReader.preferredFont` (Default: `"Outfit, Inter, sans-serif"`): Preferred font family for the RSVP Viewer.

---

## 🛠️ Development & Building

To run and compile the extension locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build / Watch compilation:**
   - Compile code:
     ```bash
     npm run compile
     ```
   - Watch mode (auto-recompile on save):
     ```bash
     npm run watch
     ```

3. **Run tests:**
   ```bash
   npm run test
   ```
