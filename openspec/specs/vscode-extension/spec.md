# Purpose
TBD - VS Code Extension capability for RSVP Markdown Reader.

# Requirements

### Requirement: Command Palette RSVP Commands
The VS Code extension SHALL register Command Palette commands and keyboard shortcut targets using the `rsvp-viewer` namespace to launch RSVP reading.
- A command `rsvp-viewer.readActiveFile` (titled `rsvp-viewer: Read Active File`) to read the entire active document's content.
- A command `rsvp-viewer.readSelection` (titled `rsvp-viewer: Read Selection`) to read only the currently selected text.
- These commands SHALL be exposed in the Command Palette (accessible via `Ctrl + Shift + P`) and editor context menus.
- These commands SHALL support Markdown documents, plain text, and comment blocks in source code.

#### Scenario: Running command on active editor
- **WHEN** the user executes the command `rsvp-viewer: Read Active File` from the Command Palette
- **THEN** the extension SHALL extract the text content of the active editor, parse it, and launch the RSVP Webview player with this content.

#### Scenario: Running command on active text selection
- **WHEN** the user selects a block of text and triggers `rsvp-viewer: Read Selection` via the Command Palette (Ctrl+Shift+P)
- **THEN** the extension SHALL extract only the selected text block, clean it, and launch the RSVP Webview player with the selected content.

### Requirement: RSVP Player Webview Panel Management
The extension SHALL create and manage a VS Code Webview panel to display the RSVP player interface.
- The Webview panel SHALL be opened in a custom Editor Tab or Sidebar panel based on user settings.
- The extension and Webview SHALL exchange messages (e.g., loaded text stream, play/pause commands, current word state).
- Only one RSVP Viewer panel instance SHALL be active at any given time (subsequent launches reuse or refresh the existing panel).

#### Scenario: Reusing existing Webview panel
- **WHEN** the user runs `rsvp-viewer.readSelection` while an RSVP Webview panel is already open
- **THEN** the extension SHALL update the open panel with the new word stream, reveal the panel, and reset playback progress to the beginning.

### Requirement: Configuration Settings Sync
The extension SHALL read configuration values from the VS Code user settings workspace (`rsvpReader.*`) and pass them to the Webview UI.
- The configurable settings SHALL include: `defaultWpm` (number), `orpColor` (string/hex/theme token), `fontSize` (number), and `preferredFont` (string).
- Changes to VS Code settings SHALL update the running Webview player dynamically.

#### Scenario: Synchronizing configuration changes
- **WHEN** the user modifies `rsvpReader.defaultWpm` to `400` in VS Code settings
- **THEN** the extension SHALL notify the Webview panel of the change, and the Webview player WPM SHALL update to `400`.

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

