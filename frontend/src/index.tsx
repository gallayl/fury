import React from "react";
import ReactDOM from "react-dom";
import { SessionContextProvider } from "./context/session-context";
import { MainRouter } from "./main-router";

ReactDOM.render(
  <SessionContextProvider>
    <MainRouter />
  </SessionContextProvider>,
  document.getElementById("root")
);
