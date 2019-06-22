import { Injector } from "@furystack/inject";
import { ConsoleLogger } from "@furystack/logging";
import "@furystack/http-api";
import { InMemoryStore } from "@furystack/core";
import { routing } from "./routing";
import { seed } from "./seed";
import { User } from "./models";

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
  .useHttpApi({})
  .useHttpAuthentication({
    getUserStore: sm => sm.getStoreFor(User)
  })
  .useDefaultLoginRoutes()
  .addHttpRouting(routing)
  .listenHttp({ port: 666 });

seed(i);
