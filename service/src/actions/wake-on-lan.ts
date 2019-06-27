import { IncomingMessage, ServerResponse } from "http";
import { RequestAction, Authenticate } from "@furystack/http-api";
import { wake } from "wake_on_lan";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class WakeOnLanAction implements RequestAction {
  public async exec() {
    const postBody = await this.req.readPostBody<{ mac: string }>();
    await new Promise((resolve, reject) => {
      wake(postBody.mac, err => {
        if (err) {
          this.resp.sendJson({
            statusCode: 500,
            json: { error: err }
          });
          reject(err);
        } else {
          this.resp.sendJson({
            json: { success: true }
          });
          resolve();
        }
      });
    });
  }

  public dispose() {}

  constructor(
    private req: IncomingMessage,
    private resp: ServerResponse,
    public injector: Injector
  ) {}
}
