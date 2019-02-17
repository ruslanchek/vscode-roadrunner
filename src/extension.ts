import * as vscode from "vscode";
import { RoadrunnerProvider } from "./Provider";
import { Task } from "./Task";

const roadrunnerProvider = new RoadrunnerProvider();

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
      } else {
        vscode.window.showOpenDialog({
          canSelectMany: false,
          openLabel: "Open",
          filters: {
            "Text files": ["txt"],
            "All files": ["*"]
          }
        });
      }
    })
  );
}

export function deactivate() {}
