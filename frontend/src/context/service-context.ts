import { createContext } from "react";

export const ServiceContext = createContext(process.env.APP_SERVICE_URL);
