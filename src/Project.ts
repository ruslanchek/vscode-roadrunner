import * as vscode from "vscode";
import { icons } from "./Icons";

export class Project extends vscode.TreeItem {
  constructor(
    readonly folder: vscode.WorkspaceFolder,
    readonly collapsibleState: vscode.TreeItemCollapsibleState,
    readonly description: string
  ) {
    super(folder.name, collapsibleState);
    this.resourceUri = folder.uri;
    this.iconPath = icons.folder;
  }

  contextValue = "project";
}
