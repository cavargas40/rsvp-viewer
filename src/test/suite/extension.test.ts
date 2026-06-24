import * as assert from "assert";
import * as vscode from "vscode";

describe("Extension Test Suite", () => {
  before(async () => {
    vscode.window.showInformationMessage("Starting RSVP Reader Integration Tests...");
    const ext = vscode.extensions.getExtension("personal.rsvp-viewer");
    if (ext) {
      await ext.activate();
    }
  });

  it("Commands should be registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("rsvp-viewer.readActiveFile"));
    assert.ok(commands.includes("rsvp-viewer.readSelection"));
  });

  it("Sidebar view focus command should be registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("rsvp-viewer.playerView.focus"));
  });

  it("Default config parameters should exist", () => {
    const config = vscode.workspace.getConfiguration("rsvpReader");
    assert.strictEqual(config.get<number>("defaultWpm"), 300);
    assert.strictEqual(
      config.get<string>("orpColor"),
      "var(--vscode-editorError-foreground, #ff0000)"
    );
    assert.strictEqual(config.get<number>("fontSize"), 28);
    assert.strictEqual(config.get<string>("preferredFont"), "Outfit, Inter, sans-serif");
  });
});
