import { HashRouter } from "react-router-dom";
import React, { useContext } from "react";
import { SessionContext } from "./context/session-context";
import { CurrentUser } from "./components/current-user";
import { Login } from "./components/login";

export const MainRouter: React.FunctionComponent = () => {
  const session = useContext(SessionContext);
  return (
    <HashRouter>{session.currentUser ? <CurrentUser /> : <Login />}</HashRouter>
  );
};
