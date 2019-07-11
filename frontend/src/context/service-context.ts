import { createContext } from "react";

const currentURL = new URL(
  process.env.APP_SERVICE_URL || window.location.toString()
);

export const ServiceContext = createContext({
  url: process.env.APP_SERVICE_URL,
  mqttUrl: `${currentURL.protocol.startsWith("https") ? "wss" : "ws"}://${
    currentURL.host
  }/mqtt`,
  fetch: ((url: string, init?: RequestInit) =>
    fetch(`${process.env.APP_SERVICE_URL}${url}`, {
      ...init,
      credentials: "include"
    })).bind(window)
});
