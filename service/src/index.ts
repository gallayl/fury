import { Injector } from "@furystack/inject";
import { ConsoleLogger } from "@furystack/logging";
import "@furystack/http-api";

import { setupRouting } from "./routing";

export const i = new Injector()
  .useLogging(ConsoleLogger)
  .useHttpApi({})
  .useHttpAuthentication()
  .useDefaultLoginRoutes()
  .listenHttp();

setupRouting(i);
