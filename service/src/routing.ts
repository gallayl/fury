import { parse } from "url";
import { IncomingMessage } from "http";
import { RequestAction } from "@furystack/http-api";
import { Constructable } from "@furystack/inject";
import { GetSystemLoadAction } from "./actions/get-system-load";
import { GetSystemDetailsAction } from "./actions/get-system-details";

export const routing: (
  msg: IncomingMessage
) => Constructable<RequestAction> | undefined = (msg: IncomingMessage) => {
  const urlPathName = parse(msg.url || "", true).pathname;

  /**
   * GET Requests section.
   */
  if (msg.method === "GET") {
    switch (urlPathName) {
      case "/getSystemLoad":
        return GetSystemLoadAction;
      case "/getSystemDetails":
        return GetSystemDetailsAction;
      default:
        break;
    }
  }

  /**
   * POST requests section
   */
  if (msg.method === "POST") {
    switch (urlPathName) {
      default:
        break;
    }
  }
  return undefined;
};
