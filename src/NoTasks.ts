import * as vscode from "vscode";
import * as path from "path";
import { RoadrunnerProvider } from "./Provider";
import { icons } from "./Icons";
import { Task } from "./Task";

export class NoTasks extends vscode.TreeItem {
  constructor(
    readonly providerContext: RoadrunnerProvider,
    readonly workspaceName: string,
    readonly workspacePath: string
  ) {
    super("No tasks", vscode.TreeItemCollapsibleState.None);
  }

  get id() {
    return this.contextValue;
  }

  public get contextValue() {
    return "noTasks";
  }

  get tooltip(): string {
    return `Thre is no tasks in ${this.workspacePath}/package.json`;
  }

  get iconPath() {
    return icons.inactiveTask;
  }
}
