import { ServerResponse, IncomingMessage } from "http";
import { existsSync, statSync, createReadStream } from "fs";
import { parse } from "url";
import { RequestAction, Authenticate } from "@furystack/http-api";
import { Injectable, Injector } from "@furystack/inject";

@Injectable()
@Authenticate()
export class StreamVideoAction implements RequestAction {
  public async exec(): Promise<void> {
    const videoPath = parse(
      this.request.url || "?video=",
      true
    ).query.video.toString();

    if (!videoPath || !existsSync(videoPath.toString())) {
      this.response.writeHead(400, "Bad request");
      this.response.end(
        JSON.stringify({
          error: `Video '${videoPath}' does not exists!`
        })
      );
      return;
    }

    const stat = statSync(videoPath);
    const fileSize = stat.size;
    const { range } = this.request.headers;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      };
      this.response.writeHead(206, head);
      file.pipe(this.response);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4"
      };
      this.response.writeHead(200, head);
      createReadStream(videoPath).pipe(this.response);
    }
  }
  public dispose() {
    /** */
  }

  constructor(
    private readonly request: IncomingMessage,
    private readonly response: ServerResponse,
    public readonly injector: Injector
  ) {}
}
