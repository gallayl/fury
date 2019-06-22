import { Injector } from "@furystack/inject";
import "@furystack/logging";
import "@furystack/http-api";
import { ConsoleLogger } from "@furystack/logging";
import { setupRouting } from "./routing";

export const i = new Injector()
  .useLogging(ConsoleLogger)
  .useHttpApi({})
  .useHttpAuthentication()
  .useDefaultLoginRoutes()
  .listenHttp();

setupRouting(i);
