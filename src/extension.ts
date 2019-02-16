import * as vscode from "vscode";
import { RoadrunnerProvider, Task } from "./Provider";

const roadrunnerProvider = new RoadrunnerProvider(vscode.workspace.rootPath!);

vscode.window.registerTreeDataProvider("roadrunnerTasks", roadrunnerProvider);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.refreshTasks", () => {
      roadrunnerProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.restartAll", () => {
      roadrunnerProvider.restartAllTerminals();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.stopAll", () => {
      roadrunnerProvider.closeAllTerminals();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.stop", (task: Task) => {
      roadrunnerProvider.closeTerminal(task.label);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.run", (task: Task) => {
      roadrunnerProvider.run(task);
    })
  );
}

export function deactivate() {}
