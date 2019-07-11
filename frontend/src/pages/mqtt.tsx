import React, { useEffect, useState } from "react";
import { connect } from "mqtt";

export const Mqtt: React.FunctionComponent = () => {
  const [url] = useState("ws://localhost:1884/");

  const [client] = useState(
    connect(
      url,
      {
        clientId: "fury",
        resubscribe: true
      }
    )
  );

  useEffect(() => {
    client.on("connect", () => {
      client.subscribe("presence", err => {
        if (!err) {
          client.publish("presence", "Hello mqtt");
        }
      });
    });

    client.on("message", (topic, message) => {
      // message is Buffer
      console.log("Message: ", { topic, message: message.toString() });
    });

    client.on("error", e => console.warn(e));
  }, [url, client]);

  return <div>MQTT</div>;
};
