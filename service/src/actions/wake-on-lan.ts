import { IncomingMessage, ServerResponse } from "http";
import { RequestAction, Utils } from "@furystack/http-api";
import { wake } from "wake_on_lan";
import { Injectable } from "@furystack/inject";

@Injectable()
export class WakeOnLanAction implements RequestAction {
  public async exec() {
    const postBody = await this.utils.readPostBody<{ mac: string }>(this.req);
    await new Promise((resolve, reject) => {
      wake(postBody.mac, err => {
        if (err) {
          this.resp.writeHead(500);
          this.resp.end(err);
          reject(err);
        } else {
          this.resp.writeHead(200);
          this.resp.end("{success:true}");
          resolve();
        }
      });
    });
  }

  public dispose() {}

  constructor(
    private req: IncomingMessage,
    private resp: ServerResponse,
    private utils: Utils
  ) {}
}
