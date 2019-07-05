import { RequestAction, JsonResult } from "@furystack/http-api";
import { StoreManager } from "@furystack/core";
import { I2CDevice } from "../services/i2c-store";

export const GetI2CDevicesAction: RequestAction = async injector => {
  const store = injector.getInstance(StoreManager).getStoreFor(I2CDevice);
  const devices = await store.search({});
  return JsonResult(devices);
};
