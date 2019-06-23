import { Stats } from "fs";
import { Injectable } from "@furystack/inject";
import { Disposable, ObservableValue } from "@sensenet/client-utils";
import chokidar, { FSWatcher } from "chokidar";

export interface FileSystemChange {
  eventName: "add" | "addDir" | "change" | "unlink" | "unlinkDir";
  path: string;
  stats?: Stats;
}

export interface FileSystemWatcherRecord {
  listener: FSWatcher;
  onChange: ObservableValue<FileSystemChange>;
}

@Injectable({ lifetime: "singleton" })
export class FileSystemWatcherService implements Disposable {
  public dispose() {
    for (const watcher of this.watchers.entries()) {
      watcher[1].listener.close();
    }
    this.watchers.clear();
  }
  private readonly watchers = new Map<string, FileSystemWatcherRecord>();
  public watchPath(pathToWatch: string) {
    let watcher = this.watchers.get(pathToWatch);

    if (!watcher) {
      const onChange = new ObservableValue<FileSystemChange>();

      const listener = chokidar.watch(pathToWatch, { persistent: true });
      listener.on("all", (eventName, path, stats) =>
        onChange.setValue({ eventName, path, stats })
      );
      watcher = {
        listener,
        onChange
      };
      this.watchers.set(pathToWatch, watcher);
    }

    return watcher;
  }
}
