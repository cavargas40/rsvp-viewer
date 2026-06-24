import * as vscode from "vscode";
import { RSVPWord } from "./documentProcessor";
import { getHtmlForWebview } from "./webviewHelper";

export class RsvpViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "rsvp-viewer.playerView";

  private _view?: vscode.WebviewView;
  private _words?: RSVPWord[];
  private _disposables: vscode.Disposable[] = [];

  constructor(private readonly _extensionUri: vscode.Uri) {
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

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "dist", "webview"),
      ],
    };

    webviewView.webview.html = getHtmlForWebview(webviewView.webview, this._extensionUri);

    webviewView.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "ready":
            if (this._words) {
              this.loadWords(this._words);
            }
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

    // Clean up when view is disposed
    webviewView.onDidDispose(() => {
      this._view = undefined;
    });
  }

  public isVisible(): boolean {
    return this._view ? this._view.visible : false;
  }

  public showWords(words: RSVPWord[]) {
    this._words = words;
    if (this._view) {
      this._view.show(true); // Focus the view in VS Code
      this.loadWords(words);
    }
  }

  public loadWords(words: RSVPWord[]) {
    this._words = words;
    if (this._view) {
      this._view.webview.postMessage({
        type: "load",
        words: words,
      });
    }
  }

  public sendSettings() {
    if (this._view) {
      const config = vscode.workspace.getConfiguration("rsvpReader");
      const settings = {
        defaultWpm: config.get<number>("defaultWpm", 300),
        orpColor: config.get<string>("orpColor", "var(--vscode-editorError-foreground, #ff453a)"),
        fontSize: config.get<number>("fontSize", 28),
        preferredFont: config.get<string>("preferredFont", "Outfit, Inter, sans-serif"),
      };

      this._view.webview.postMessage({
        type: "settings",
        settings: settings,
      });
    }
  }

  public dispose() {
    this._view = undefined;
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
