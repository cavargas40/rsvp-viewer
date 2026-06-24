## Why

Currently, the RSVP player only opens in a standard Webview Editor Panel (editor tab). This restricts users from keeping the reader pinned to a sidebar, bottom panel, or custom layout while working on code side-by-side. Providing a sidebar webview allows the player to be docked or moved anywhere on the screen using VS Code's native view dragging capabilities.

## What Changes

- Add a custom RSVP Viewer icon to the Activity Bar (left panel).
- Register a Sidebar View containing the RSVP player.
- Implement a `WebviewViewProvider` to render and control the RSVP player within the sidebar view.
- Update the read commands (`rsvp-viewer.readActiveFile` and `rsvp-viewer.readSelection`) to target the sidebar view player when active/configured, fallback to the editor tab panel, or load words into the sidebar view when visible.
- Support native VS Code view positioning, allowing the user to drag the RSVP player into any layout slot (editor columns, bottom panel, secondary sidebar).

## Capabilities

### New Capabilities

### Modified Capabilities

- `vscode-extension`: Add requirements for Activity Bar icons, Sidebar Webview views, registering `WebviewViewProvider`, and routing word streams to either the Sidebar View or the Webview Editor Panel depending on state and user configuration.

## Impact

- `package.json`: Register `viewsContainers` and `views` contribution points.
- `src/extension.ts`: Update command activations to support target selection and register `RsvpViewProvider`.
- `src/rsvpViewProvider.ts`: Create a new provider implementing `vscode.WebviewViewProvider` to host the sidebar/panel player.
- `src/rsvpPanel.ts`: Align message passing interface and configuration sync with the sidebar provider.
- `src/webview/player.js`: Ensure the webview player handles sizing constraints of a narrow sidebar view gracefully.
