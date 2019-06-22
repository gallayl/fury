import { parse } from "url";
import { HttpExtendedInjector } from "@furystack/http-api";
import { GetSystemLoadAction } from "./actions/get-system-load";

export const setupRouting = (injector: HttpExtendedInjector) => {
  injector.addHttpRouting(msg => {
    const urlPathName = parse(msg.url || "", true).pathname;
    switch (urlPathName) {
      case "/getSystemLoad":
        return GetSystemLoadAction;
      default:
        return undefined;
    }
  });
};
