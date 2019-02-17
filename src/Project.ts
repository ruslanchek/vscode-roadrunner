import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class Project extends vscode.TreeItem {
  constructor(readonly folder: vscode.WorkspaceFolder) {
    super(folder.name, vscode.TreeItemCollapsibleState.Expanded);
    this.resourceUri = folder.uri;
  }

  contextValue = "project";
}
