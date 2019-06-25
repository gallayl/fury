import { createContext } from "react";

export const ServiceContext = createContext(
  window.location.host === "localhost"
    ? process.env.APP_SERVICE_URL
    : `${window.location.protocol}//${window.location.host}/`
);
