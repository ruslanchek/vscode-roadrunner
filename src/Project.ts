import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class Project extends vscode.TreeItem {
  constructor(readonly folder: vscode.WorkspaceFolder) {
    super(folder.name, vscode.TreeItemCollapsibleState.Expanded);
    this.resourceUri = folder.uri;
    this.iconPath = {
      light: path.join(__filename, "..", "..", "resources", `folder.svg`),
      dark: path.join(__filename, "..", "..", "resources", `folder.svg`)
    };
  }

  contextValue = "project";
}
