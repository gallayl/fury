import { HashRouter } from "react-router-dom";
import React, { useContext } from "react";
import { SessionContext } from "./context/session-context";
import { CurrentUser } from "./components/current-user";
import { Login } from "./components/login";
import { useTheme } from "./hooks/use-theme";

export const MainRouter: React.FunctionComponent = () => {
  const session = useContext(SessionContext);
  const theme = useTheme();
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.background.default,
        backgroundImage: `url(/fury_background.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden"
      }}
    >
      <HashRouter>
        {session.isLoggedIn ? <CurrentUser /> : <Login />}
      </HashRouter>
    </div>
  );
};
