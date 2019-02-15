// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { RoadrunnerProvider, Task } from "./Provider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const roadrunnerProvider = new RoadrunnerProvider(vscode.workspace.rootPath!);
  vscode.window.registerTreeDataProvider("roadrunnerTasks", roadrunnerProvider);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "roadrunner" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const refreshTasks = vscode.commands.registerCommand(
    "roadrunner.refreshTasks",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Refresh tasks");

      roadrunnerProvider.refresh();
    }
  );

  const restartAll = vscode.commands.registerCommand(
    "roadrunner.restartAll",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Restart all tasks");
    }
  );

  const stopAll = vscode.commands.registerCommand("roadrunner.stopAll", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage(
      "Stop all tasks" + vscode.workspace.rootPath
    );
  });

  const stop = vscode.commands.registerCommand("roadrunner.stop", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("Stop task");
  });

  const start = vscode.commands.registerCommand(
    "roadrunner.run",
    (data: Task) => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage(JSON.stringify(data));
      const terminal = vscode.window.createTerminal(data.label);

      terminal.show();
      terminal.sendText(`npm run ${data.script}`);
    }
  );

  context.subscriptions.push(refreshTasks, restartAll, stopAll, stop, start);
}

// this method is called when your extension is deactivated
export function deactivate() {}
