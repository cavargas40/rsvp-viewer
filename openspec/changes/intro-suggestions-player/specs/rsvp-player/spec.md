## ADDED Requirements

### Requirement: RSVP Viewer Welcome Intro Screen
The RSVP Viewer UI SHALL display a welcome/intro screen when no word stream is loaded. This welcome/intro screen SHALL suggest instructions on how to use the player, such as selecting text or running commands, and SHALL hide or disable controls that require an active text stream.

#### Scenario: Displaying welcome intro on empty player loading
- **WHEN** the RSVP Viewer is initialized with an empty word stream
- **THEN** the system SHALL show the welcome/intro screen and hide the word display viewer and progress indicators.

#### Scenario: Hiding welcome intro when words are loaded
- **WHEN** the player receives a non-empty word stream
- **THEN** the system SHALL hide the welcome/intro screen, reveal the word display viewer and progress indicators, and load the words into the player.

### Requirement: OS-Specific Keyboard Shortcut Display
The RSVP Viewer UI welcome screen SHALL dynamically detect the client operating system and display the matching VS Code Command Palette shortcut.

#### Scenario: Displaying macOS Command Palette shortcut
- **WHEN** the webview runs on macOS (detected via user agent/platform)
- **THEN** the system SHALL display "Cmd + Shift + P" as the Command Palette keyboard shortcut.

#### Scenario: Displaying Windows and Linux Command Palette shortcut
- **WHEN** the webview runs on Windows or Linux
- **THEN** the system SHALL display "Ctrl + Shift + P" as the Command Palette keyboard shortcut.
