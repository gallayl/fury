import { useContext } from "react";
import "@furystack/logging";
import { InjectorContext } from "../context/injector-context";

export const useLogger = (scope: string) => {
  return useContext(InjectorContext).logger.withScope(scope);
};
