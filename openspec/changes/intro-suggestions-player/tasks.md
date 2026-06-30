## 1. Webview UI Implementation

- [x] 1.1 Add the welcome/intro container overlay HTML structure with suggestions and keyboard shortcut keycap formatting in `src/webview/player.html`.
- [x] 1.2 Implement premium styling, layout alignment, light/dark mode compatibility, and visibility toggles in `src/webview/player.css`.
- [x] 1.3 Update state management logic in `src/webview/player.js` to hide player controls and show the intro screen when no content is loaded, and transition to player controls/viewer-box on word load.
- [x] 1.4 Implement client-side OS detection logic in `src/webview/player.js` to dynamically display the correct Command Palette keyboard shortcut (`Cmd + Shift + P` on macOS, `Ctrl + Shift + P` otherwise).

## 2. Extension Host Alignment

- [x] 2.1 Verify `src/rsvpViewProvider.ts` starts without streaming words by default to trigger the intro page on sidebar resolution.
- [x] 2.2 Verify `src/rsvpPanel.ts` handles loading states cleanly.

## 3. Verification & Testing

- [x] 3.1 Run unit tests using `npm run test:unit` to ensure no regressions in document processing.
- [x] 3.2 Run integration tests using `npm run test:integration` and confirm they pass successfully.
- [x] 3.3 Manually verify visually premium behavior in VS Code sidebar and editor panels in both light and dark themes, verifying the correct keyboard shortcut matches the OS.
