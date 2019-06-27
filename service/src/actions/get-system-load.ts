import { ServerResponse } from "http";
import { freemem, totalmem, uptime } from "os";
import { cpuTemperature, currentLoad } from "systeminformation";
import { RequestAction, Authenticate } from "@furystack/http-api";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class GetSystemLoadAction implements RequestAction {
  public async exec(): Promise<void> {
    const [cpuTemperatureValue, currentLoadValue] = await Promise.all([
      new Promise(resolve => cpuTemperature(resolve)),
      new Promise(resolve => currentLoad(resolve))
    ]);

    const responseBody = {
      freemem: freemem(),
      totalmem: totalmem(),
      uptime: uptime(),
      currentLoad: currentLoadValue,
      cpuTemperature: cpuTemperatureValue
    };

    this.response.sendJson({
      json: responseBody
    });
  }
  public dispose() {
    /** */
  }

  constructor(
    public readonly injector: Injector,
    private readonly response: ServerResponse
  ) {}
}
