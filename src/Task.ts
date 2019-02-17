import * as vscode from "vscode";
import * as path from "path";
import { RoadrunnerProvider } from "./Provider";
import { icons } from "./Icons";

enum EPackageManager {
  Npm = "npm",
  Yarn = "yarn"
}

export class Task extends vscode.TreeItem {
  constructor(
    readonly providerContext: RoadrunnerProvider,
    readonly label: string,
    readonly script: string,
    readonly collapsibleState: vscode.TreeItemCollapsibleState,
    readonly workspaceName: string,
    readonly workspacePath: string
  ) {
    super(label, collapsibleState);
  }

  get contextValue() {
    return this.isRunning ? "activeTask" : "task";
  }

  get currentPackageManager(): EPackageManager {
    return (
      vscode.workspace.getConfiguration("npm").get("packageManager") ||
      EPackageManager.Npm
    );
  }

  get terminalaCommand(): string {
    switch (this.currentPackageManager) {
      case EPackageManager.Yarn: {
        return `cd ${this.workspacePath} && yarn ${this.label}`;
      }

      case EPackageManager.Npm:
      default: {
        return `cd ${this.workspacePath} && npm run ${this.label}`;
      }
    }
  }

  get id(): string {
    return `${this.workspaceName} – ${this.label}`;
  }

  get tooltip(): string {
    return `${this.label}: ${this.script}`;
  }

  get description(): string {
    return "";
  }

  get isRunning(): boolean {
    const terminalInstance = this.providerContext.terminals.get(this.id);
    return Boolean(terminalInstance);
  }

  get iconPath() {
    return this.isRunning ? icons.activeTask : icons.inactiveTask;
  }
}
