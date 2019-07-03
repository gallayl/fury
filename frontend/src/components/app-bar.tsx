import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import Equalizer from "@material-ui/icons/Equalizer";
import React, { useContext } from "react";
import { SessionContext } from "../context/session-context";
import { useTheme } from "../hooks/use-theme";

export const FuryAppBar: React.StatelessComponent = () => {
  const session = useContext(SessionContext);
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: theme.palette.background.paper }}>
        <a href="#/">
          <img src="/favicon-32x32.png" />
        </a>

        <div style={{ flex: 1 }}></div>
        <a href="#/status">
          <IconButton>
            <Equalizer />
          </IconButton>
        </a>
        <IconButton
          onClick={() => {
            if (confirm("Really log out?")) {
              session.logout();
            }
          }}
        >
          <PowerSettingsNew />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
