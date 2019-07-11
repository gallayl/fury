import { createServer } from "net";
import { Injector } from "@furystack/inject/dist/Injector";
import { Server as AedesServer, AedesOptions } from "aedes";
import ws from "websocket-stream";
import { ServerManager } from "@furystack/core";

export interface MqttSettings {
  mqttPort: number;
  aedesSettings?: AedesOptions;
}

// tslint:disable-next-line: no-unused-expression
declare module "@furystack/inject/dist/Injector" {
  interface Injector {
    setupMqtt: (settings: MqttSettings) => Injector;
  }
}

// tslint:disable-next-line: no-unnecessary-type-annotation
Injector.prototype.setupMqtt = function(settings) {
  const logger = this.logger.withScope("Mqtt");
  const aedesServer = AedesServer({
    ...settings.aedesSettings,
    authenticate: (client, _username, _password, done) => {
      console.log(client);
      done(null, true);
    }
  });

  const mqttServer = createServer(aedesServer.handle);
  mqttServer.listen(settings.mqttPort, () => {
    logger.information({
      message: `MQTT server is listening at port ${settings.mqttPort}`
    });
  });

  for (const server of this.getInstance(ServerManager).getServers()) {
    ws.createServer(
      {
        server
      },
      aedesServer.handle as any
    );
  }
  return this;
};
