import React, { useEffect, useState, useContext } from "react";
import { connect } from "mqtt";
import { ServiceContext } from "../context/service-context";

export const Mqtt: React.FunctionComponent = () => {
  const service = useContext(ServiceContext);

  const [client] = useState(
    connect(
      service.mqttUrl,
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
  }, [service, client]);

  return <div>MQTT</div>;
};
