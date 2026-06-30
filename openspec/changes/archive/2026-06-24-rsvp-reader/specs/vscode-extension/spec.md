## ADDED Requirements

### Requirement: Command Palette RSVP Commands
The VS Code extension SHALL register Command Palette commands and keyboard shortcut targets using the `rsvp-vscode` namespace to launch RSVP reading.
- A command `rsvp-vscode.readActiveFile` (titled `rsvp-vscode: Read Active File`) to read the entire active document's content.
- A command `rsvp-vscode.readSelection` (titled `rsvp-vscode: Read Selection`) to read only the currently selected text.
- These commands SHALL be exposed in the Command Palette (accessible via `Ctrl + Shift + P`) and editor context menus.
- These commands SHALL support Markdown documents, plain text, and comment blocks in source code.

#### Scenario: Running command on active editor
- **WHEN** the user executes the command `rsvp-vscode: Read Active File` from the Command Palette
- **THEN** the extension SHALL extract the text content of the active editor, parse it, and launch the RSVP Webview player with this content.

#### Scenario: Running command on active text selection
- **WHEN** the user selects a block of text and triggers `rsvp-vscode: Read Selection` via the Command Palette (Ctrl+Shift+P)
- **THEN** the extension SHALL extract only the selected text block, clean it, and launch the RSVP Webview player with the selected content.

### Requirement: RSVP Player Webview Panel Management
The extension SHALL create and manage a VS Code Webview panel to display the RSVP player interface.
- The Webview panel SHALL be opened in a custom Editor Tab or Sidebar panel based on user settings.
- The extension and Webview SHALL exchange messages (e.g., loaded text stream, play/pause commands, current word state).
- Only one RSVP Viewer panel instance SHALL be active at any given time (subsequent launches reuse or refresh the existing panel).

#### Scenario: Reusing existing Webview panel
- **WHEN** the user runs `rsvp-vscode.readSelection` while an RSVP Webview panel is already open
- **THEN** the extension SHALL update the open panel with the new word stream, reveal the panel, and reset playback progress to the beginning.

### Requirement: Configuration Settings Sync
The extension SHALL read configuration values from the VS Code user settings workspace (`rsvpReader.*`) and pass them to the Webview UI.
- The configurable settings SHALL include: `defaultWpm` (number), `orpColor` (string/hex/theme token), `fontSize` (number), and `preferredFont` (string).
- Changes to VS Code settings SHALL update the running Webview player dynamically.

#### Scenario: Synchronizing configuration changes
- **WHEN** the user modifies `rsvpReader.defaultWpm` to `400` in VS Code settings
- **THEN** the extension SHALL notify the Webview panel of the change, and the Webview player WPM SHALL update to `400`.

