## Context

Currently, the RSVP viewer only supports opening as an editor tab (`vscode.WebviewPanel`). Users need the ability to pin the player to a sidebar or panel so it does not take up precious editor screen space, and so it can be moved around dynamically.

## Goals / Non-Goals

**Goals:**
- Provide a Sidebar activity bar view container and a Sidebar View for the RSVP reader.
- Allow users to drag/position the RSVP player anywhere (e.g., sidebars, panel, editor area) using native VS Code functionality.
- Reuse the existing HTML, CSS, and JS player bundle to minimize logic duplication.
- Route reading command outputs automatically: target the sidebar view if it's open/visible; otherwise, fallback to the editor tab panel.

**Non-Goals:**
- Creating a separate frontend codebase for the sidebar player.
- Supporting multi-instance playback in both the sidebar and the editor tab simultaneously.

## Decisions

### Decision 1: Register RsvpViewProvider implementing WebviewViewProvider
We will introduce `RsvpViewProvider` implementing `vscode.WebviewViewProvider`. It will be registered under the view ID `rsvp-viewer.playerView` inside the custom activity bar container `rsvp-viewer-sidebar`.
- *Alternatives considered*: Implementing a custom TreeView with custom commands. However, the player relies on rich HTML5 render loop and ORP display, which is only possible in Webview.

### Decision 2: Reuse player assets and HTML construction
`RsvpViewProvider` will load the exact same `player.html`, `player.css`, and `player.js` assets. We will refactor or share the HTML replacement logic. Since `RsvpPanel` and `RsvpViewProvider` both deal with a `vscode.Webview` instance, we can write a helper function `getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri)` to construct the HTML.

### Decision 3: Action target coordination
When commands are run, the extension needs to know where to send words:
- We will store the active `RsvpViewProvider` instance inside `extension.ts`.
- In the command handlers, if `rsvpViewProvider.isVisible()` is true, we send the word stream to the sidebar.
- Otherwise, we default to showing/updating the `RsvpPanel`.

## Risks / Trade-offs

- **Risk**: The player container width in the sidebar will be much narrower than an editor tab, which could cause text overflow or misalignment.
- **Mitigation**: The `player.css` uses flexbox and relative dimensions. We will ensure the viewport constraints are tested and that text auto-fits or wraps appropriately inside narrow sidebars.
