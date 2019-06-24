import { useContext } from "react";
import { InjectorContext } from "../context/injector-context";

export const useInjector = () => {
  return useContext(InjectorContext);
};
