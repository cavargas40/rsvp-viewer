## 1. Project Initialization & Setup

- [x] 1.1 Create the baseline configuration files: `package.json`, `tsconfig.json`, and `.vscodeignore` for a VS Code extension.
- [x] 1.2 Define configuration parameters (`rsvpReader.defaultWpm`, `rsvpReader.orpColor`, `rsvpReader.fontSize`, `rsvpReader.preferredFont`) in the package.json contribution schema.
- [x] 1.3 Create launch configurations under `.vscode/launch.json` to enable debugging and testing.

## 2. Document Processor Module

- [x] 2.1 Create `src/documentProcessor.ts` to tokenize text and calculate custom pacing.
- [x] 2.2 Implement regex patterns to strip markdown formatting characters and code comment characters.
- [x] 2.3 Implement punctuation-based delay calculations (sentence boundaries, comma pauses, list item gaps, paragraph transitions).

## 3. RSVP Word Alignment Engine

- [x] 3.1 Implement ORP index mathematical calculation based on word length.
- [x] 3.2 Create word split logic to segment each word into prefix, target ORP character, and suffix strings.
- [x] 3.3 Create test helper script or mock tests to confirm punctuation pacing and ORP calculation correctness.

## 4. Webview Player (UI & Styles)

- [x] 4.1 Create `src/webview/player.html` containing the player container, metrics display, progress indicators, and settings drawer.
- [x] 4.2 Write clean CSS files to style the player with glassmorphism, responsive grid layout, theme-matching variables, and vertical ORP guides.
- [x] 4.3 Implement `player.js` script with the recursive setTimeout timer loop to display words at calculated intervals.
- [x] 4.4 Add controls logic: play/pause state handling, keyboard listener bindings (Space, Arrows, Escape), and WPM slider interaction.

## 5. VS Code Webview Manager

- [x] 5.1 Create `src/rsvpPanel.ts` to coordinate Webview panel creation, HTML injection, and Webview lifecycle.
- [x] 5.2 Establish communications channel to transmit parsed word streams and current configuration updates.
- [x] 5.3 Register `rsvp-vscode.readActiveFile` and `rsvp-vscode.readSelection` commands (titled `rsvp-vscode: Read Active File` and `rsvp-vscode: Read Selection`) in `src/extension.ts`.
- [x] 5.4 Listen to VS Code workspace configuration events to sync modified options dynamically to the player.

## 6. Verification and Polish

- [x] 6.1 Verify RSVP reader launching against various sample Markdown and code files in a VS Code extension host window.
- [x] 6.2 Test word skipping, comment stripping, and punctuation delay behaviors manually.
- [x] 6.3 Build package using vsce locally to ensure no bundle issues or compilation errors exist.
