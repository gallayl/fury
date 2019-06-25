import { join } from "path";
import { Injector } from "@furystack/inject";
import { ConsoleLogger } from "@furystack/logging";
import "@furystack/http-api";
import { InMemoryStore } from "@furystack/core";
import { routing } from "./routing";
import { seed } from "./seed";
import { User } from "./models";
import { FileSystemWatcherService } from "./services/filesystem-watcher";

export const i = new Injector()
  .useLogging(ConsoleLogger)
  .setupStores(stores =>
    stores.addStore(
      new InMemoryStore({
        model: User,
        primaryKey: "username"
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
    getUserStore: sm => sm.getStoreFor(User)
  })
  .useDefaultLoginRoutes()
  .addHttpRouting(routing)
  .listenHttp({ port: 9090 });

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
