import * as vscode from "vscode";
import { RoadrunnerProvider } from "./Provider";
import { Task } from "./Task";

const statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left,
  100
);

const roadrunnerProvider = new RoadrunnerProvider(statusBar);

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("roadrunnerTasks", roadrunnerProvider);

  roadrunnerProvider.refresh();

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
      roadrunnerProvider.closeTerminal(task.id);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.run", (task: Task) => {
      if (task) {
        roadrunnerProvider.run(task.id);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("roadrunner.focusTerminal", () => {})
  );
}

export function deactivate() {}
