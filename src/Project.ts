import * as vscode from "vscode";
import { icons } from "./Icons";

export class Project extends vscode.TreeItem {
  constructor(readonly folder: vscode.WorkspaceFolder) {
    super(folder.name, vscode.TreeItemCollapsibleState.Expanded);
    this.resourceUri = folder.uri;
    this.iconPath = icons.folder;
  }

  contextValue = "project";
}
