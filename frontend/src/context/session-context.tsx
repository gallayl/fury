import React, {
  useEffect,
  useContext,
  useCallback,
  createContext,
  useState
} from "react";
import { User } from "../models/user";
import { useLogger } from "../hooks/use-logger";
import { ServiceContext } from "./service-context";

export interface SessionContextValue {
  currentUser: User | undefined;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  isLoggedIn: boolean;
}

export const SessionContext = createContext<SessionContextValue>({
  currentUser: undefined,
  login: async () => {
    throw Error("CurrentUserContext not initialized!");
  },
  logout: async () => {
    throw Error("CurrentUserContext not initialized!");
  },
  isLoggedIn: false
});

export const SessionContextProvider: React.FunctionComponent = props => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const serviceContext = useContext(ServiceContext);

  useEffect(() => {
    if (!currentUser || currentUser.username === "Visitor") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [currentUser]);

  const logger = useLogger("SessionContextProvider");

  useEffect(() => {
    (async () => {
      try {
        const result = await serviceContext.fetch(`/currentUser`);
        if (result.ok) {
          const json = await result.json();
          setCurrentUser(json);
          logger.information({
            message: "Current user fetched",
            data: { currentUser: json }
          });
        } else {
          logger.warning({
            message: "Request is not OK while fetching current user",
            data: { result }
          });
          setCurrentUser(undefined);
        }
      } catch (error) {
        logger.warning({
          message: "Failed to fetch current user",
          data: { error }
        });
        setCurrentUser(undefined);
      }
    })();
  }, [logger, serviceContext]);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const result = await serviceContext.fetch(`/login`, {
          method: "POST",
          body: JSON.stringify({ username, password })
        });
        if (result.ok) {
          const json: User = await result.json();
          setCurrentUser(json);
          logger.information({
            message: "Logged in",
            data: { user: json }
          });
        } else {
          setCurrentUser(undefined);
          logger.warning({
            message: "Login was unsuccessful",
            data: { result }
          });
        }
      } catch (error) {
        setCurrentUser(undefined);
        logger.warning({
          message: "Login request failed",
          data: { error }
        });
      }
    },
    [logger, serviceContext]
  );
  const logout = useCallback(async () => {
    try {
      const result = await fetch(`${serviceContext}/logout`, {
        method: "POST",
        credentials: "include",
        mode: "cors"
      });
      if (result.ok) {
        logger.information({
          message: "Logged out",
          data: { user: currentUser }
        });
      } else {
        logger.warning({
          message: "Logout was unsuccesful",
          data: { result }
        });
      }
    } catch (error) {
      logger.warning({
        message: "Logout request failed",
        data: { error }
      });
    } finally {
      setCurrentUser(undefined);
    }
  }, [currentUser, logger, serviceContext]);

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isLoggedIn
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
