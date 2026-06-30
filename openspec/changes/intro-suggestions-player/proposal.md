## Why

When the RSVP Viewer extension loads (especially in the sidebar on startup), it displays an empty player showing only the static word "Ready" with no instructions or context. This can confuse users on how to use the extension. Introducing a helper/intro screen will guide users on how to initiate reading.

## What Changes

- **Intro / Help screen**: A visually appealing, premium welcome panel displaying instructions on how to use the player.
- **Suggested Actions**: List the primary actions:
  - Select text and trigger `rsvp-viewer.readSelection`
  - Open a file and trigger `rsvp-viewer.readActiveFile`
- **OS-specific Keyboard Shortcuts Hint**: Detect the user's operating system (macOS vs. Windows/Linux) and display the correct Command Palette keyboard shortcut (`Cmd + Shift + P` on macOS, `Ctrl + Shift + P` on Windows and Linux) to search for RSVP commands.
- **Dynamic Toggle**: Transition to the standard player UI once text is successfully loaded, and revert or allow stopping back to the intro.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `rsvp-player`: Introduce an initial welcome/intro state and UI mode when no word stream is loaded, including OS-specific instructions.
- `vscode-extension`: Ensure that on startup/load, if there is no active text stream, the webviews render the welcome/intro state.

## Impact

- **Webview UI (`player.html`, `player.css`, `player.js`)**: Add intro container, detect OS in client script, toggle visibility based on word loading.
- **Extension host (`rsvpPanel.ts`, `rsvpViewProvider.ts`)**: Initialize player webviews in the intro/unloaded state by default.
