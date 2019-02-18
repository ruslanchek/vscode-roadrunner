import * as vscode from "vscode";
import * as fs from "fs";
import { Task } from "./Task";
import { Project } from "./Project";

export interface ITerminalInstance {
  terminal: vscode.Terminal;
}

export class RoadrunnerProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  public terminals: Map<string, ITerminalInstance> = new Map();
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem
  > = new vscode.EventEmitter<vscode.TreeItem>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this
    ._onDidChangeTreeData.event;

  constructor(readonly statusBar: vscode.StatusBarItem) {
    statusBar.show();
    // statusBar.command = "roadrunner.show";
  }

  updateStatusBar() {
    const runningTasks = this.getAllTasks().filter(task => task.isRunning);

    this.statusBar.tooltip = "Roadrunner active tasks";
    this.statusBar.text = `$(play) ${runningTasks.length}`;
  }

  getTerminal(id: string): ITerminalInstance {
    let terminalInstance = this.terminals.get(id);

    if (!terminalInstance) {
      terminalInstance = {
        terminal: vscode.window.createTerminal(id)
      };

      this.terminals.set(id, terminalInstance);
      this.refresh();
    }

    return terminalInstance;
  }

  findTask(taskId: string): Task | undefined {
    return this.getAllTasks().find(task => task.id === taskId);
  }

  run(taskId: string) {
    const task = this.findTask(taskId);

    if (task) {
      const { terminal } = this.getTerminal(task.id);

      terminal.show();
      terminal.sendText(task.terminalCommand);

      this.refresh();
    }
  }

  closeTerminal(taskId: string) {
    const task = this.findTask(taskId);

    if (task) {
      const terminalInstance = this.terminals.get(task.id);

      if (terminalInstance) {
        terminalInstance.terminal.dispose();
        this.terminals.delete(task.id);
      }

      this.refresh();
    }
  }

  restartAllTerminals() {
    const running = Array.from(this.terminals.keys());

    this.terminals.forEach((terminalInstance, key) => {
      this.closeTerminal(key);
    });

    this.getAllTasks().forEach(task => {
      if (running.includes(task.id)) {
        this.run(task.id);
      }
    });

    this.refresh();
  }

  closeAllTerminals() {
    this.terminals.forEach((terminalInstance, key) => {
      this.closeTerminal(key);
    });

    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
    this.updateStatusBar();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element: vscode.TreeItem): vscode.TreeItem[] {
    if (element && element.resourceUri && element.label) {
      return this.getTasks(element.label, element.resourceUri.fsPath);
    } else {
      return this.getWorkspaceItems();
    }
  }

  private getWorkspaceItems(): vscode.TreeItem[] {
    if (vscode.workspace && vscode.workspace.workspaceFolders) {
      const projects: Project[] = [];

      vscode.workspace.workspaceFolders.forEach(folder => {
        if (
          folder.uri &&
          folder.uri.fsPath &&
          this.readPackageScripts(`${folder.uri.fsPath}/package.json`)
        ) {
          projects.push(
            new Project(folder, vscode.TreeItemCollapsibleState.Expanded, "")
          );
        } else {
          projects.push(
            new Project(
              folder,
              vscode.TreeItemCollapsibleState.None,
              "No tasks"
            )
          );
        }
      });

      return projects;
    } else {
      return [];
    }
  }

  private readPackageScripts(
    packageJsonPath: string
  ): { [key: string]: string } | null {
    try {
      if (this.pathExists(packageJsonPath)) {
        const packageJson = fs.readFileSync(packageJsonPath, "utf-8");

        if (packageJson && JSON.parse(packageJson)) {
          return JSON.parse(packageJson).scripts;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  private getAllTasks(): Task[] {
    if (vscode.workspace.workspaceFolders) {
      let tasks: Task[] = [];

      vscode.workspace.workspaceFolders.forEach(folder => {
        const packageJsonPath = `${folder.uri.fsPath}/package.json`;

        if (this.pathExists(packageJsonPath)) {
          tasks = tasks.concat(this.getTasks(folder.name, folder.uri.fsPath));
        }
      });

      return tasks;
    } else {
      return [];
    }
  }

  private getTasks(workspaceName: string, workspacePath: string): Task[] {
    const path = `${workspacePath}/package.json`;

    if (this.pathExists(path)) {
      const packageJsonScripts = this.readPackageScripts(path);

      if (packageJsonScripts) {
        return Object.keys(packageJsonScripts).map(
          script =>
            new Task(
              this,
              script,
              packageJsonScripts[script],
              workspaceName,
              workspacePath
            )
        );
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}
