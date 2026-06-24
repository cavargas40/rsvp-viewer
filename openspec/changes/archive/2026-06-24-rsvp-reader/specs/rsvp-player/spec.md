## ADDED Requirements

### Requirement: RSVP Player ORP Display
The RSVP Player SHALL display words one at a time, centered horizontally and vertically on a target focus point corresponding to the word's Optimal Recognition Point (ORP). The ORP letter of the word SHALL be highlighted in a distinct accent color (default: red) to guide the reader's gaze.

#### Scenario: Single word ORP calculation and highlighting
- **WHEN** the player receives the word "Visual" to display
- **THEN** the system SHALL calculate the ORP position as index 2 (the character 's', 0-indexed), display the word centered around 's', and color the character 's' in the accent color.

#### Scenario: Displaying short or empty words
- **WHEN** the player receives a short word like "a" or "in"
- **THEN** the system SHALL calculate the ORP position as index 0, and display it with the first letter highlighted.

### Requirement: RSVP Playback State Controls
The RSVP Player SHALL support play, pause, stop, WPM (Words Per Minute) speed adjustments, and skip navigation. Playback controls MUST be accessible via interactive buttons in the UI and customizable keyboard shortcuts.

#### Scenario: Play and Pause toggle
- **WHEN** the user triggers the Play action while paused
- **THEN** the player SHALL transition to the playing state and begin rendering words sequentially at the interval defined by the WPM.
- **WHEN** the user triggers the Pause action while playing
- **THEN** the player SHALL immediately pause rendering and hold the current word on screen.

#### Scenario: Speed adjustment
- **WHEN** the user increases or decreases the WPM setting (e.g., from 300 to 350 WPM)
- **THEN** the system SHALL recalculate the timer interval dynamically and update the speed of word presentation immediately.

#### Scenario: Word and Sentence skipping
- **WHEN** the user triggers a skip backward or forward command
- **THEN** the player SHALL update the current index to the previous or next word or sentence boundary and pause playback if it was running.

### Requirement: Reading Progress and Metrics
The RSVP Player UI SHALL display visual indicators showing current reading progress, including percent of text completed, estimated time remaining (based on current WPM), and a visual progress bar.

#### Scenario: Updating progress metrics during playback
- **WHEN** the player displays a word at index 50 of 200 total words at 300 WPM
- **THEN** the progress bar SHALL show 25% completion, and the estimated time remaining SHALL display "30 seconds".

### Requirement: Player Styling and Accessibility
The RSVP Player SHALL support dark/light theme switching matching the user's current VS Code theme, font size adjustment, font family selection, and custom focus point color selection.

#### Scenario: Synchronizing theme with VS Code
- **WHEN** the user shifts VS Code from light theme to dark theme
- **THEN** the RSVP Player Webview CSS properties SHALL dynamically update to match the editor background, text color, and primary border colors.
