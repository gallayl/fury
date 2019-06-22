import { ServerResponse } from "http";
import { freemem, totalmem, uptime } from "os";
import { cpuTemperature, currentLoad } from "systeminformation";
import { RequestAction, HttpUserContext } from "@furystack/http-api";
import { Injectable } from "@furystack/inject";

@Injectable()
export class GetSystemLoadAction implements RequestAction {
  public async exec(): Promise<void> {
    if (
      (await this.userContext.getCurrentUser()) ===
      this.userContext.authentication.visitorUser
    ) {
      this.response.writeHead(401, "Unauthorized");
      this.response.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

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

    this.response.writeHead(200, {
      "Content-Type": "application/json"
    });
    this.response.write(JSON.stringify(responseBody));
    this.response.end();
  }
  public dispose() {
    /** */
  }

  constructor(
    private readonly userContext: HttpUserContext,
    private readonly response: ServerResponse
  ) {}
}
