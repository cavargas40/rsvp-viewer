## Why

With the rise of AI models and tools, almost all human-friendly output, generated documentation, and reference materials are written in Markdown. However, reading long Markdown logs, AI responses, documentation, or code comments inside VS Code can be slow and mentally fatiguing due to eye strain and constant saccadic movements. Integrating a Rapid Serial Visual Presentation (RSVP) reader inside VS Code will allow developers to quickly consume documentation, specs, readmes, and selected text blocks at high speeds (e.g., 200–600+ words per minute) directly inside their favorite IDE.

## What Changes

- Add a Command Palette command (`Ctrl + Shift + P` -> `rsvp-vscode: Read Selection` or `rsvp-vscode: Read Active File`) to launch the RSVP reader.
- Support reading Markdown documents as well as other common text formats (plain text, code comments, JSON/YAML text blocks, etc.).
- Add a beautiful, responsive Webview-based player with play, pause, speed (WPM) controls, progression metrics, and forward/backward skipping.
- Add a settings interface to configure RSVP speed, styling (e.g., ORP highlight color), and reading behavior.
- Parse Markdown and text content to clean up headers, tables, links, code blocks, formatting markup, or comments before presenting it word-by-word.

## Capabilities

### New Capabilities

- `rsvp-player`: The interactive RSVP player Webview interface, featuring playback controls, speed adjustments (WPM), progress indicators, and word alignment using Optimal Recognition Point (ORP) math.
- `document-processor`: A utility to clean and structure Markdown, plain text, and code comments into a clean word-by-word stream suitable for RSVP, handling formatting tags, headers, links, and syntax without cluttering the display.
- `vscode-extension`: VS Code integration including commands registered under `rsvp-vscode` in the Command Palette, context menu bindings, VS Code settings sync, and Webview lifetime management.

### Modified Capabilities

<!-- None -->

## Impact

- **New Dependencies**: We'll create a VS Code extension, requiring `vscode` api types, and bundling web assets for the Webview.
- **APIs**: New VS Code extension configuration namespace `rsvpReader` for settings (defaultWpm, orpColor, fonts).
- **Files**: All new files, establishing the extension workspace structure.

