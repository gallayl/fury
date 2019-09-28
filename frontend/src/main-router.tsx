import { HashRouter, Route } from "react-router-dom";
import React, { useContext } from "react";
import { Switch } from "react-router";
import { SessionContext } from "./context/session-context";
import { Login } from "./components/login";
import { useTheme } from "./hooks/use-theme";
import { Home } from "./pages/home";
import { FuryAppBar } from "./components/app-bar";
import { Status } from "./pages/status";
import { ServiceContext } from "./context/service-context";
import { Mqtt } from "./pages/mqtt";

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
      {session.isLoggedIn ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%"
          }}
        >
          <FuryAppBar />
          <HashRouter>
            <Switch>
              <Route path="/status" exact>
                <Status />
              </Route>
              <Route path="/mqtt" exact>
                <Mqtt />
              </Route>
              <Route path="/secret" exact>
                <ServiceContext.Consumer>
                  {service => (
                    <video id="videoPlayer" controls>
                      <source
                        src={`${service.url}/video?video=${encodeURIComponent(
                          "f:\\Filmek\\Star Wars\\Star.Wars.Episode.VIII.The.Last.Jedi.2017.RETAiL.1080p.BluRay.DTS.x264.HuN-HyperX\\swthelastjedi-1080p-hyperx.mkv"
                        )}`}
                        //type="video/mp4"
                        type='video/mp4; codecs="theora, vorbis"'
                      />
                    </video>
                  )}
                </ServiceContext.Consumer>
              </Route>
              <Route path="">
                <Home />
              </Route>
            </Switch>
          </HashRouter>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};
