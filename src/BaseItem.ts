import * as vscode from "vscode";

export abstract class BaseItem extends vscode.TreeItem {
  public id: string = "";
  public terminalCommand: string = "";
}
