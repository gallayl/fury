import { parse } from "url";
import { IncomingMessage } from "http";
import { RequestAction } from "@furystack/http-api";
import { Constructable } from "@furystack/inject";
import { GetSystemLoadAction } from "./actions/get-system-load";
import { GetSystemDetailsAction } from "./actions/get-system-details";
import { WakeOnLanAction } from "./actions/wake-on-lan";
import { StreamVideoAction } from "./actions/stream-video";

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
      case "/video":
        return StreamVideoAction;
      default:
        break;
    }
  }

  /**
   * POST requests section
   */
  if (msg.method === "POST") {
    switch (urlPathName) {
      case "/wake":
        return WakeOnLanAction;
      default:
        break;
    }
  }
  return undefined;
};
