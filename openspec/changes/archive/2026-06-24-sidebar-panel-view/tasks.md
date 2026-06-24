## 1. Setup & Assets

- [x] 1.1 Create a custom SVG icon at `media/icon.svg` for the Activity Bar.
- [x] 1.2 Refactor the HTML template generation from `src/rsvpPanel.ts` to a shared helper so it can be reused by both `RsvpPanel` and `RsvpViewProvider`.

## 2. Views and Contribution Points

- [x] 2.1 Update `package.json` to add the `viewsContainers` contribution point for a custom Activity Bar item.
- [x] 2.2 Update `package.json` to add the `views` contribution point registering the `rsvp-viewer.playerView` Webview View.

## 3. Sidebar Webview View Provider

- [x] 3.1 Create `src/rsvpViewProvider.ts` implementing `vscode.WebviewViewProvider`.
- [x] 3.2 Implement `resolveWebviewView` to configure options, set up the webview HTML content, and handle incoming messages (`ready`, `updateSetting`).
- [x] 3.3 Implement configuration change listeners in `RsvpViewProvider` to sync changes dynamically.
- [x] 3.4 Implement a method `showWords(words: RSVPWord[])` inside the provider to load words and trigger visibility of the view.

## 4. Extension Integration & Command Routing

- [x] 4.1 Instantiate and register the `RsvpViewProvider` during extension activation in `src/extension.ts`.
- [x] 4.2 Update `rsvp-viewer.readActiveFile` and `rsvp-viewer.readSelection` command handlers to route words to the Sidebar Webview View if visible, falling back to the Webview Panel if not.
- [x] 4.3 Verify cleanup of provider listeners and disposables on extension deactivation.

## 5. Verification & Tests

- [x] 5.1 Update integration tests in `src/test/suite/extension.test.ts` to assert that the `rsvp-viewer.playerView` provider is registered.
- [x] 5.2 Run compilation and full test suite (`npm run test`) to verify code correctness and compatibility.
