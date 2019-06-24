import React, { useEffect, useContext, useCallback } from "react";
import { createContext, useState } from "react";
import { User } from "../models/user";
import { ServiceContext } from "./service-context";
import { useLogger } from "../hooks/use-logger";

export interface SessionContextValue {
  currentUser: User | undefined;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue>({
  currentUser: undefined,
  login: async () => {
    throw Error("CurrentUserContext not initialized!");
  },
  logout: async () => {
    throw Error("CurrentUserContext not initialized!");
  }
});

export const SessionContextProvider: React.FunctionComponent = props => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const serviceContext = useContext(ServiceContext);

  const logger = useLogger("SessionContextProvider");

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(`${serviceContext}/currentUser`, {
          credentials: "include",
          mode: "cors",
          method: "get"
        });
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
  }, [serviceContext]);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const result = await fetch(`${serviceContext}/login`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({ username, password })
        });
        if (result.ok) {
          const json = await result.json();
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
    [serviceContext]
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
  }, [serviceContext]);

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        login,
        logout
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
