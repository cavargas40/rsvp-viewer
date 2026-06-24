import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Generates the HTML content for the RSVP player webview (both panel and view provider).
 * Replaces placeholders for Uri and CSP settings.
 */
export function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const webviewUri = webview
    .asWebviewUri(vscode.Uri.joinPath(extensionUri, "dist", "webview"))
    .toString();

  const htmlPath = path.join(
    extensionUri.fsPath,
    "dist",
    "webview",
    "player.html"
  );

  let htmlContent = fs.readFileSync(htmlPath, "utf8");

  // Replace placeholders
  htmlContent = htmlContent
    .replace(/\{\{webviewUri\}\}/g, webviewUri)
    .replace(/\{\{cspSource\}\}/g, webview.cspSource);

  return htmlContent;
}
