import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface ITerminalInstance {
  terminal: vscode.Terminal;
}

export class RoadrunnerProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem
  > = new vscode.EventEmitter<vscode.TreeItem>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  public terminals: Map<string, ITerminalInstance> = new Map();

  getTerminal(label: string): ITerminalInstance {
    let terminalInstance = this.terminals.get(label);

    if (!terminalInstance) {
      terminalInstance = {
        terminal: vscode.window.createTerminal(label)
      };

      this.terminals.set(label, terminalInstance);
      this.refresh();
    }

    return terminalInstance;
  }

  run(task: Task) {
    const { terminal } = this.getTerminal(task.label);

    terminal.show();
    terminal.sendText(`npm run ${task.label}`);
  }

  closeTerminal(label: string) {
    const terminalInstance = this.terminals.get(label);

    if (terminalInstance) {
      terminalInstance.terminal.dispose();
      this.terminals.delete(label);
    }

    this.refresh();
  }

  restartAllTerminals() {
    const running = Array.from(this.terminals.keys());

    this.terminals.forEach((terminalInstance, key) => {
      this.closeTerminal(key);
    });

    // this.getChildren().then((tasks: Task[]) => {
    //   tasks.forEach(task => {
    //     if (running.includes(task.label)) {
    //       this.run(task);
    //     }
    //   });
    // });

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
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<vscode.TreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No tasks in empty workspace");
      return Promise.resolve([]);
    }

    return Promise.resolve(this.getWorkspaceItems());

    const packageJsonPath = path.join(this.workspaceRoot, "package.json");

    if (this.pathExists(packageJsonPath)) {
      return Promise.resolve(this.getTasks(packageJsonPath));
    } else {
      vscode.window.showInformationMessage("Workspace has no package.json");
      return Promise.resolve([]);
    }
  }

  private getWorkspaceItems(): vscode.TreeItem[] {
    return vscode.workspace.workspaceFolders!.map(folder => {
      return {
        id: folder.index.toString(),
        label: folder.name,
        collapsableState: vscode.TreeItemCollapsibleState.Collapsed,
        iconPath: {
          light: path.join(__filename, "..", "..", "resources", `folder.svg`),
          dark: path.join(__filename, "..", "..", "resources", `folder.svg`)
        }
      };
    });
  }

  private getTasks(packageJsonPath: string): Task[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      return Object.keys(packageJson.scripts).map(
        script =>
          new Task(
            this,
            script,
            packageJson.scripts[script],
            vscode.TreeItemCollapsibleState.None
          )
      );
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

export class Task extends vscode.TreeItem {
  constructor(
    readonly providerContext: RoadrunnerProvider,
    readonly label: string,
    readonly script: string,
    readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  contextValue = "task";

  get tooltip(): string {
    return `${this.label}: ${this.script}`;
  }

  get description(): string {
    return "running";
  }

  get isRunning(): boolean {
    const terminalInstance = this.providerContext.terminals.get(this.label);

    return Boolean(terminalInstance);
  }

  get iconPath() {
    const iconName = this.isRunning ? "active" : "inactive";

    return {
      light: path.join(__filename, "..", "..", "resources", `${iconName}.svg`),
      dark: path.join(__filename, "..", "..", "resources", `${iconName}.svg`)
    };
  }
}
