import React, { useState, useContext } from "react";
import { Paper, TextField, Button } from "@material-ui/core";
import { SessionContext } from "../context/session-context";

export const Login: React.FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const session = useContext(SessionContext);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper>
        <form style={{ margin: "1em" }} onSubmit={ev => ev.preventDefault()}>
          <TextField
            required
            type="text"
            placeholder="Username"
            label="Username"
            helperText="The login name of the user"
            fullWidth
            onChange={ev => setUsername(ev.target.value)}
          />
          <TextField
            required
            fullWidth
            type="password"
            placeholder="Password"
            label="Password"
            onChange={ev => setPassword(ev.target.value)}
          />
          <Button
            onClick={() => session.login(username, password)}
            type="submit"
          >
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
};
