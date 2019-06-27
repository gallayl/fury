import { ServerResponse } from "http";
import { join } from "path";
import { RequestAction, Authenticate } from "@furystack/http-api";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class GetReleaseInfoAction implements RequestAction {
  public async exec(): Promise<void> {
    try {
      const responseBody = await import(
        join(process.cwd(), "releaseinfo.json")
      );
      this.response.writeHead(200, {
        "Content-Type": "application/json"
      });
      this.response.end(responseBody);
    } catch (error) {
      this.response.sendJson({
        statusCode: 500,
        json: {
          message: "There was an error while reading the release info",
          error
        }
      });
    }
  }
  public dispose() {
    /** */
  }

  constructor(
    public readonly injector: Injector,
    private readonly response: ServerResponse
  ) {}
}
