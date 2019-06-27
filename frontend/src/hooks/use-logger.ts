import { useContext, useState } from "react";
import "@furystack/logging";
import { InjectorContext } from "../context/injector-context";

export const useLogger = (scope: string) => {
  const [logger] = useState(
    useContext(InjectorContext).logger.withScope(scope)
  );
  return logger;
};
