import React, { useState, useContext } from "react";
import { SessionContext } from "../context/session-context";

export const Login: React.FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const session = useContext(SessionContext);
  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={ev => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={ev => setPassword(ev.target.value)}
      />
      <button onClick={() => session.login(username, password)}>Login</button>
    </div>
  );
};
