import { ServerResponse } from "http";
import { platform, type, release, hostname } from "os";
import { cpu, mem, diskLayout, fsSize } from "systeminformation";
import { Authenticate, RequestAction } from "@furystack/http-api";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class GetSystemDetailsAction implements RequestAction {
  public async exec(): Promise<void> {
    // const cpuValue = await new Promise(resolve => cpu(resolve));

    const [
      cpuValue,
      memValue,
      diskLayoutValue,
      fsSizeValue
    ] = await Promise.all([cpu(), mem(), diskLayout(), fsSize()]);

    const responseBody = {
      platform: platform(),
      osType: type(),
      osRelease: release(),
      cpu: cpuValue,
      hostname: hostname(),
      mem: memValue,
      diskLayout: diskLayoutValue,
      fsSize: fsSizeValue
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
