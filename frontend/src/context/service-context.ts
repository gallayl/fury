import { createContext } from "react";

export const ServiceContext = createContext({
  url: process.env.APP_SERVICE_URL,
  fetch: ((url: string, init?: RequestInit) =>
    fetch(`${process.env.APP_SERVICE_URL}${url}`, {
      ...init,
      credentials: "include"
    })).bind(window)
});
