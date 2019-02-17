import * as path from "path";

export const icons = {
  folder: {
    light: path.join(__filename, "..", "..", "resources", `folder.svg`),
    dark: path.join(__filename, "..", "..", "resources", `folder.svg`)
  },

  activeTask: {
    light: path.join(__filename, "..", "..", "resources", `active-task.svg`),
    dark: path.join(__filename, "..", "..", "resources", `active-task.svg`)
  },

  inactiveTask: {
    light: path.join(__filename, "..", "..", "resources", `inactive-task.svg`),
    dark: path.join(__filename, "..", "..", "resources", `inactive-task.svg`)
  }
};
