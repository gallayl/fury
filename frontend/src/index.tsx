import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { SessionContextProvider } from "./context/session-context";
import { MainRouter } from "./main-router";
import { ThemeContext } from "./context/theme-context";
import { MqttContextProvider } from "./context/mqtt-context";

console.log(
  `%cFury app v${process.env.APP_VERSION}
Branch ${process.env.GIT_BRANCH}
Commit '${process.env.GIT_COMMITHASH}
Bundled at ${process.env.BUILD_DATE}
AppService ${process.env.APP_SERVICE_URL}
' `,
  "color: #333;"
);

ReactDOM.render(
  <SessionContextProvider>
    <ThemeContext.Consumer>
      {theme => (
        <ThemeProvider theme={theme}>
          <MqttContextProvider>
            <MainRouter />
          </MqttContextProvider>
        </ThemeProvider>
      )}
    </ThemeContext.Consumer>
  </SessionContextProvider>,
  document.getElementById("root")
);
