import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class RoadrunnerProvider implements vscode.TreeDataProvider<Task> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Task | undefined
  > = new vscode.EventEmitter<Task | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Task | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Task): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<Task[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No tasks in empty workspace");
      return Promise.resolve([]);
    }

    const packageJsonPath = path.join(this.workspaceRoot, "package.json");

    if (this.pathExists(packageJsonPath)) {
      return Promise.resolve(this.getTasks(packageJsonPath));
    } else {
      vscode.window.showInformationMessage("Workspace has no package.json");
      return Promise.resolve([]);
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getTasks(packageJsonPath: string): Task[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      return Object.keys(packageJson.scripts).map(
        script => new Task(script, packageJson.scripts[script])
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
    public readonly label: string,
    public readonly command: vscode.Command
  ) {
    super(label);
  }

  get tooltip(): string {
    return `${this.label}: ${this.command}`;
  }

  get description(): string {
    return "running";
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "resources", "task.svg"),
    dark: path.join(__filename, "..", "..", "resources", "task.svg")
  };

  contextValue = "task";
}
