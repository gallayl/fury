import { HashRouter, Switch } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "./context/session-context";
import React from "react";
import { CurrentUser } from "./components/current-user";
import { Login } from "./components/login";

export const MainRouter: React.FunctionComponent = () => {
  const session = useContext(SessionContext);
  return (
    <HashRouter>{session.currentUser ? <CurrentUser /> : <Login />}</HashRouter>
  );
};
