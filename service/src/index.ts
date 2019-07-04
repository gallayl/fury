import { join } from "path";
import { Injector } from "@furystack/inject";
import { ConsoleLogger } from "@furystack/logging";
import "@furystack/http-api";
import "@furystack/mongodb-store";
import { FileStore } from "@furystack/core";
import { routing } from "./routing";
import { seed } from "./seed";
import { User, Session } from "./models";
import { FileSystemWatcherService } from "./services/filesystem-watcher";
import { registerExitHandler } from "./exitHandler";

export const i = new Injector()
  .useLogging(ConsoleLogger)
  .setupStores(stores =>
    stores.useMongoDb(User, "mongodb://localhost", "Fury", "users").addStore(
      new FileStore({
        model: Session,
        fileName: join(process.cwd(), "sessions.json"),
        primaryKey: "sessionId",
        logger: stores.injector.logger,
        tickMs: 1000 * 60 * 10
      })
    )
  )
  .useHttpApi({
    corsOptions: {
      credentials: true,
      origins: ["http://localhost:8080"]
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
  });

registerExitHandler(i);

seed(i);

i.getInstance(FileSystemWatcherService)
  .watchPath(join(process.cwd(), "data"))
  .onChange.subscribe(value => {
    console.log("FS changed", value);
  });

// setTimeout(() => {
//   i.logger.information({ scope: "system", message: "Shuttin' down..." });
//   i.dispose(); //.getInstance(FileSystemWatcherService).dispose();
// }, 20 * 1000);
