import { ServerResponse } from "http";
import { platform, type, release, hostname } from "os";
import { cpu } from "systeminformation";
import { Authenticate, RequestAction } from "@furystack/http-api";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class GetSystemDetailsAction implements RequestAction {
  public async exec(): Promise<void> {
    const cpuValue = await new Promise(resolve => cpu(resolve));
    const responseBody = {
      platform: platform(),
      osType: type(),
      osRelease: release(),
      cpu: cpuValue,
      hostname: hostname()
    };

    this.response.sendJson({ json: responseBody });
  }
  public dispose() {
    /** */
  }

  constructor(
    public injector: Injector,
    private readonly response: ServerResponse
  ) {}
}
