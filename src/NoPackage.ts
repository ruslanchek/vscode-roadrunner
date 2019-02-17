import * as vscode from "vscode";
import { RoadrunnerProvider } from "./Provider";
import { icons } from "./Icons";

export class NoPackage extends vscode.TreeItem {
  constructor(
    readonly providerContext: RoadrunnerProvider,
    readonly workspaceName: string,
    readonly workspacePath: string
  ) {
    super("No package.json", vscode.TreeItemCollapsibleState.None);
  }

  get contextValue() {
    return "noPackage";
  }

  get tooltip(): string {
    return `Thre is no package.json in ${this.workspacePath}`;
  }

  get iconPath() {
    return icons.inactiveTask;
  }
}
