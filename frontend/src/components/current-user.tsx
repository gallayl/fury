import React, { useContext } from "react";
import { SessionContext } from "../context/session-context";

export const CurrentUser: React.FunctionComponent = () => {
  const session = useContext(SessionContext);
  return (
    <div>
      Welcome, {session.currentUser && session.currentUser.username}! <br />
      <button onClick={() => session.logout()}>Log out</button>
    </div>
  );
};
