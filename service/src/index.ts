import { join } from "path";
import { Injector } from "@furystack/inject";
import { VerboseConsoleLogger } from "@furystack/logging";
import {
  LoginAction,
  LogoutAction,
  GetCurrentUser,
  HttpUserContext
} from "@furystack/http-api";
import "@furystack/typeorm-store";
import { EdmType } from "@furystack/odata";
import { DataSetSettings } from "@furystack/repository";
import { routing } from "./routing";
import { seed } from "./seed";
import { User, Session, DhtSensor, NodeMcu, DhtValue } from "./models";
// import { FileSystemWatcherService } from "./services/filesystem-watcher";
import { registerExitHandler } from "./exitHandler";
import { I2CStore, I2CDevice } from "./services/i2c-store";
import "./mqtt-injector-extensions";

export const authorizedOnly = async (options: { injector: Injector }) => {
  const authorized = await options.injector
    .getInstance(HttpUserContext)
    .isAuthenticated();
  return {
    isAllowed: authorized,
    message: "You are not authorized :("
  };
};

export const authorizedDataSet: Partial<DataSetSettings<any>> = {
  authorizeAdd: authorizedOnly,
  authorizeGet: authorizedOnly,
  authorizeRemove: authorizedOnly,
  authorizeUpdate: authorizedOnly,
  authroizeRemoveEntity: authorizedOnly
};

export const i = new Injector()
  .useLogging(VerboseConsoleLogger)
  .useTypeOrm({
    type: "sqlite",
    database: join(process.cwd(), "data.sqlite"),
    entities: [User, Session, DhtSensor, DhtValue, NodeMcu],
    logging: false,
    synchronize: true
  })
  .setupStores(stores =>
    stores
      .useTypeOrmStore(User)
      .useTypeOrmStore(Session)
      .useTypeOrmStore(DhtSensor)
      .useTypeOrmStore(DhtValue)
      .useTypeOrmStore(NodeMcu)
      .addStore(new I2CStore(stores.injector))
  )
  .useHttpApi({
    corsOptions: {
      credentials: true,
      origins: ["http://localhost:8080"],
      headers: ["cache", "content-type"]
    }
  })
  .useHttpAuthentication({
    getUserStore: sm => sm.getStoreFor(User),
    getSessionStore: sm => sm.getStoreFor(Session)
  })
  .useDefaultLoginRoutes()
  .addHttpRouting(routing)
  .listenHttp({
    port: parseInt(process.env.APP_SERVICE_PORT as string, 10) || 9090
  })
  .setupRepository(repo =>
    repo
      .createDataSet(I2CDevice, {
        ...authorizedDataSet,
        name: "i2cDevices"
      })
      .createDataSet(User, {
        ...authorizedDataSet,
        name: "users"
      })
      .createDataSet(DhtSensor, {
        ...authorizedDataSet,
        name: "dhtSensors"
      })
      .createDataSet(DhtValue, {
        ...authorizedDataSet,
        name: "dhtValues",
        authorizeUpdate: async () => ({
          isAllowed: false,
          message: "No update allowed!"
        })
      })
      .createDataSet(NodeMcu, {
        ...authorizedDataSet,
        name: "nodeMCUs"
      })
  )
  .useOdata("odata", odata =>
    odata.addNameSpace("default", ns => {
      ns.setupEntities(entities =>
        entities
          .addEntityType({
            model: User,
            primaryKey: "username",
            properties: [{ property: "username", type: EdmType.String }],
            name: "User"
          })
          .addEntityType({
            model: I2CDevice,
            name: "I2CDevice",
            primaryKey: "address",
            properties: [{ property: "address", type: EdmType.Int16 }]
          })
          .addEntityType({
            model: DhtSensor,
            primaryKey: "id",
            properties: [
              { property: "id", type: EdmType.Int32 },
              { property: "dataPin", type: EdmType.String },
              { property: "displayName", type: EdmType.String },
              { property: "nodeMcu", type: EdmType.Unknown }
            ]
          })
          .addEntityType({
            model: DhtValue,
            primaryKey: "id",
            properties: [
              { property: "id", type: EdmType.Int32 },
              { property: "humidityPercent", type: EdmType.Double },
              { property: "temperatureCelsius", type: EdmType.Double },
              { property: "timestamp", type: EdmType.DateTime }
            ]
          })
          .addEntityType({
            model: NodeMcu,
            primaryKey: "mac",
            properties: [
              { property: "mac", type: EdmType.String },
              { property: "ip", type: EdmType.String },
              { property: "displayName", type: EdmType.String },
              { property: "dhtSensors", type: EdmType.Unknown }
            ]
          })
      ).setupCollections(collections =>
        collections
          .addCollection({
            model: User,
            name: "users",
            functions: [
              {
                action: GetCurrentUser,
                name: "current"
              }
            ]
          })
          .addCollection({
            model: I2CDevice,
            name: "i2cDevices"
          })
          .addCollection({
            model: NodeMcu,
            name: "nodeMCUs"
          })
          .addCollection({
            model: DhtSensor,
            name: "dhtSensors"
          })
          .addCollection({
            model: DhtValue,
            name: "dhtValues"
          })
      );

      ns.setupGlobalActions([
        {
          action: LoginAction,
          name: "login",
          parameters: [
            { name: "username", type: EdmType.String, nullable: false },
            { name: "password", type: EdmType.String, nullable: false }
          ]
        },
        { action: LogoutAction, name: "logout" }
      ]);

      return ns;
    })
  )
  .setupMqtt({
    mqttPort: 1883,
    aedesSettings: {}
  });

registerExitHandler(i);

seed(i);
