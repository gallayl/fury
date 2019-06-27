import React from "react";
import ReactDOM from "react-dom";
import { SessionContextProvider } from "./context/session-context";
import { MainRouter } from "./main-router";

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
    <MainRouter />
  </SessionContextProvider>,
  document.getElementById("root")
);
