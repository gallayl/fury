import { createServer } from "net";
import { createServer as createHttpServer } from "http";
import { Injector } from "@furystack/inject/dist/Injector";
import { Server as AedesServer, AedesOptions } from "aedes";
import ws from "websocket-stream";

export interface MqttSettings {
  mqttPort: number;
  wsPort: number;
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

  const httpServer = createHttpServer();

  ws.createServer(
    {
      server: httpServer
    },
    aedesServer.handle as any
  );
  httpServer.listen(settings.wsPort, () => {
    logger.information({
      message: `MQTT WS server is listening at port ${settings.wsPort}`
    });
  });
  return this;
};
