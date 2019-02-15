import * as vscode from "vscode";
import { RoadrunnerProvider, Task } from "./Provider";

const roadrunnerProvider = new RoadrunnerProvider(vscode.workspace.rootPath!);

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("roadrunnerTasks", roadrunnerProvider);

  console.log('Congratulations, your extension "roadrunner" is now active!');

  const refreshTasks = vscode.commands.registerCommand(
    "roadrunner.refreshTasks",
    () => {
      roadrunnerProvider.refresh();
    }
  );

  const restartAll = vscode.commands.registerCommand(
    "roadrunner.restartAll",
    () => {
      roadrunnerProvider.restartAllTerminals();
      vscode.window.showInformationMessage("Restart all tasks");
    }
  );

  const stopAll = vscode.commands.registerCommand("roadrunner.stopAll", () => {
    roadrunnerProvider.closeAllTerminals();
    vscode.window.showInformationMessage("All stopped");
  });

  const stop = vscode.commands.registerCommand(
    "roadrunner.stop",
    (task: Task) => {
      roadrunnerProvider.closeTerminal(task.label);
      vscode.window.showInformationMessage(`Task ${task.label} stopped`);
    }
  );

  const run = vscode.commands.registerCommand(
    "roadrunner.run",
    (task: Task) => {
      roadrunnerProvider.run(task);
      vscode.window.showInformationMessage(`Task ${task.label} running`);
    }
  );

  context.subscriptions.push(refreshTasks, restartAll, stopAll, stop, run);
}

// this method is called when your extension is deactivated
export function deactivate() {}
