## ADDED Requirements

### Requirement: RSVP Player Sidebar Webview View Management
The extension SHALL register an Activity Bar view container and a Sidebar Webview View to host the RSVP player interface.
- The sidebar view SHALL be registered under the view container `rsvp-viewer-sidebar` with the ID `rsvp-viewer.playerView`.
- The Webview View provider SHALL load the same HTML/CSS/JS assets (`player.html`, `player.css`, `player.js`) as the Editor Tab Webview Panel.
- The Webview View SHALL retain its state when hidden or moved/dragged by the user to another panel/sidebar location.
- The extension SHALL stream processed document words to the Sidebar Webview View if the provider is registered and active.

#### Scenario: Registering the Sidebar Webview View Provider
- **WHEN** the VS Code extension activates
- **THEN** the extension SHALL register a new `WebviewViewProvider` with the identifier `rsvp-viewer.playerView`.

#### Scenario: Streaming words to the Webview View
- **WHEN** the user executes `rsvp-viewer.readActiveFile` and the Sidebar Webview View is active and initialized
- **THEN** the extension SHALL extract the words and send a message with type `load` containing the RSVPWord array to the Sidebar Webview View.

### Requirement: RSVP View Selection & Target Logic
The extension SHALL coordinate routing of the word stream depending on where the user wants to view the player.
- If the Sidebar Webview View has been initialized and is visible, it SHALL be the primary target for commands.
- If the Sidebar Webview View is not visible or initialized, commands SHALL fall back to opening the standard RSVP Editor Tab Webview Panel.

#### Scenario: Routing to visible Sidebar View
- **WHEN** the user runs `rsvp-viewer.readActiveFile` and the Sidebar View is visible
- **THEN** the extension SHALL send the word stream to the Sidebar View and focus it.

#### Scenario: Routing to Editor Tab fallback
- **WHEN** the user runs `rsvp-viewer.readActiveFile` and the Sidebar View is not visible or has not been initialized
- **THEN** the extension SHALL create or show the standard RSVP Editor Tab Webview Panel and load the word stream into it.
