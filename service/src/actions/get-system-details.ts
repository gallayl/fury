import { ServerResponse } from "http";
import { platform, type, release, hostname } from "os";
import { cpu } from "systeminformation";
import { RequestAction, HttpUserContext } from "@furystack/http-api";

export class GetSystemDetailsAction implements RequestAction {
  public async exec(): Promise<void> {
    if (
      (await this.userContext.getCurrentUser()) ===
      this.userContext.authentication.visitorUser
    ) {
      this.response.writeHead(401, "Unauthorized");
      this.response.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    const cpuValue = await new Promise(resolve => cpu(resolve));

    const responseBody = {
      platform: platform(),
      osType: type(),
      osRelease: release(),
      cpu: cpuValue,
      hostname: hostname()
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
