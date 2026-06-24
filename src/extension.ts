import * as vscode from "vscode";
import { processDocument } from "./documentProcessor";
import { RsvpPanel } from "./rsvpPanel";
import { RsvpViewProvider } from "./rsvpViewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("rsvp-viewer is now active.");

  const rsvpViewProvider = new RsvpViewProvider(context.extensionUri);

  // Register the Webview View
  const viewRegistration = vscode.window.registerWebviewViewProvider(
    RsvpViewProvider.viewType,
    rsvpViewProvider
  );

  // Command: Read Active File
  const readActiveFileCommand = vscode.commands.registerCommand(
    "rsvp-viewer.readActiveFile",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor found.");
        return;
      }

      const text = editor.document.getText();
      if (!text || text.trim().length === 0) {
        vscode.window.showInformationMessage("The active document is empty.");
        return;
      }

      const words = processDocument(text, editor.document.languageId);
      if (words.length === 0) {
        vscode.window.showInformationMessage("No readable text found in this file.");
        return;
      }

      if (rsvpViewProvider.isVisible()) {
        rsvpViewProvider.showWords(words);
      } else {
        RsvpPanel.createOrShow(context.extensionUri, words);
      }
    }
  );

  // Command: Read Selection
  const readSelectionCommand = vscode.commands.registerCommand(
    "rsvp-viewer.readSelection",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor found.");
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      if (!text || text.trim().length === 0) {
        vscode.window.showInformationMessage(
          "No selection found. Please select some text to read."
        );
        return;
      }

      const words = processDocument(text, editor.document.languageId);
      if (words.length === 0) {
        vscode.window.showInformationMessage("No readable text found in selection.");
        return;
      }

      if (rsvpViewProvider.isVisible()) {
        rsvpViewProvider.showWords(words);
      } else {
        RsvpPanel.createOrShow(context.extensionUri, words);
      }
    }
  );

  context.subscriptions.push(
    rsvpViewProvider,
    viewRegistration,
    readActiveFileCommand,
    readSelectionCommand
  );
}

export function deactivate() {
  if (RsvpPanel.currentPanel) {
    RsvpPanel.currentPanel.dispose();
  }
}
