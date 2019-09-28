import { MqttClient, connect } from "mqtt";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ServiceContext } from "./service-context";
import { SessionContext } from "./session-context";

export interface MqttContextType {
  client: MqttClient;
}

export const MqttContext = createContext<MqttClient>({} as MqttClient);

export const MqttContextProvider: React.FC = props => {
  const service = useContext(ServiceContext);
  const session = useContext(SessionContext);
  const [mqttClient, setMqttClient] = useState<MqttClient>(null as any);

  useEffect(() => {
    const newClient = connect(
      service.mqttUrl,
      {
        clientId: `fury-${session.appId}`,
        resubscribe: true
      }
    );
    setMqttClient(newClient);
  }, [service.mqttUrl, session.appId]);

  return (
    <MqttContext.Provider value={mqttClient}>
      {mqttClient && props.children}
    </MqttContext.Provider>
  );
};
