import { Injector } from "@furystack/inject";
import { createContext } from "react";
import { VerboseConsoleLogger } from "@furystack/logging";

const injector = new Injector();

injector.useLogging(VerboseConsoleLogger);

export const InjectorContext = createContext(injector);
