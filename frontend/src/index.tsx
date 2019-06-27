import "./typings";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { SessionContextProvider } from "./context/session-context";
import { MainRouter } from "./main-router";
import { ThemeContext } from "./context/theme-context";

console.log(
  `%cFury app v${process.env.APP_VERSION}
Branch ${process.env.GIT_BRANCH}
Commit '${process.env.GIT_COMMITHASH}
AppService ${process.env.APP_SERVICE_URL}
' `,
  "color: #16AAA6; border-bottom: 1px solid black"
);

ReactDOM.render(
  <SessionContextProvider>
    <ThemeContext.Consumer>
      {theme => (
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      )}
    </ThemeContext.Consumer>
  </SessionContextProvider>,
  document.getElementById("root")
);
