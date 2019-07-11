import { createContext } from "react";

const currentURL = new URL(process.env.APP_SERVICE_URL || "");

export const ServiceContext = createContext({
  url: process.env.APP_SERVICE_URL,
  mqttUrl: `${currentURL.protocol === "https" ? "wss" : "ws"}://${
    currentURL.hostname
  }:1884/`,
  fetch: ((url: string, init?: RequestInit) =>
    fetch(`${process.env.APP_SERVICE_URL}${url}`, {
      ...init,
      credentials: "include"
    })).bind(window)
});
