import * as vscode from "vscode";
import { RSVPWord } from "./documentProcessor";
import { getHtmlForWebview } from "./webviewHelper";

export class RsvpPanel {
  public static currentPanel: RsvpPanel | undefined;
  public static readonly viewType = "rsvpReader";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, words: RSVPWord[]) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it and load the new words
    if (RsvpPanel.currentPanel) {
      RsvpPanel.currentPanel._panel.reveal(column);
      RsvpPanel.currentPanel.loadWords(words);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      RsvpPanel.viewType,
      "RSVP Reader",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "dist", "webview"),
        ],
        retainContextWhenHidden: true,
      }
    );

    RsvpPanel.currentPanel = new RsvpPanel(panel, extensionUri, words);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, words: RSVPWord[]) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._updateHtml();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "ready":
            this.loadWords(words);
            this.sendSettings();
            break;
          case "updateSetting":
            const { key, value } = message;
            try {
              const config = vscode.workspace.getConfiguration("rsvpReader");
              await config.update(key, value, vscode.ConfigurationTarget.Global);
            } catch (err) {
              console.error(`Failed to update setting rsvpReader.${key}:`, err);
            }
            break;
        }
      },
      null,
      this._disposables
    );

    // Listen to configuration changes
    vscode.workspace.onDidChangeConfiguration(
      (e) => {
        if (e.affectsConfiguration("rsvpReader")) {
          this.sendSettings();
        }
      },
      null,
      this._disposables
    );
  }

  public loadWords(words: RSVPWord[]) {
    this._panel.webview.postMessage({
      type: "load",
      words: words,
    });
  }

  public sendSettings() {
    const config = vscode.workspace.getConfiguration("rsvpReader");
    const settings = {
      defaultWpm: config.get<number>("defaultWpm", 300),
      orpColor: config.get<string>("orpColor", "var(--vscode-editorError-foreground, #ff453a)"),
      fontSize: config.get<number>("fontSize", 28),
      preferredFont: config.get<string>("preferredFont", "Outfit, Inter, sans-serif"),
    };

    this._panel.webview.postMessage({
      type: "settings",
      settings: settings,
    });
  }

  private _updateHtml() {
    this._panel.webview.html = getHtmlForWebview(this._panel.webview, this._extensionUri);
  }

  public dispose() {
    RsvpPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
