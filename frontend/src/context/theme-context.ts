import { createContext } from "react";
import { createMuiTheme } from "@material-ui/core";

export const ThemeContext = createContext(
  createMuiTheme({
    palette: {
      type: "dark"
    }
  })
);
