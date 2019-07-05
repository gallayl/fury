/* eslint-disable prefer-destructuring */
import { arch } from "os";
import {
  PhysicalStore,
  InMemoryStore,
  SearchOptions,
  PartialResult
} from "@furystack/core";
import { Injectable, Injector } from "@furystack/inject";
import { ScopedLogger } from "@furystack/logging";

export class I2CDevice {
  public address!: number;
}

@Injectable({ lifetime: "singleton" })
export class I2CStore implements PhysicalStore<I2CDevice> {
  public readonly primaryKey = "address";
  public model = I2CDevice;

  private inMemoryStore = new InMemoryStore({
    model: I2CDevice,
    primaryKey: "address"
  });

  private async read() {
    this.logger.information({ message: "Reading I2C Devices..." });
    const architecture = arch();
    if (architecture === "arm") {
      const i2c = await import("i2c-bus");
      const bus = await new Promise<import("i2c-bus").I2cBus>(
        (resolve, reject) => {
          const openedBus = i2c.open(0, err => {
            err ? reject(err) : resolve(openedBus);
          });
        }
      );

      const devices: number[] = await new Promise((resolve, reject) => {
        bus.scan((err, result) => (err ? reject(err) : resolve(result)));
      });
      // eslint-disable-next-line dot-notation
      const cache = this.inMemoryStore["cache"];
      cache.clear();
      devices.map(device => this.inMemoryStore.add({ address: device }));
      this.logger.information({
        message: `Found '${devices.length}' devices.`
      });
    } else {
      this.logger.warning({
        message: `The architecture '${architecture}' is not supported. I2C Store will yield empty results`
      });
    }
  }

  public async add(_data: I2CDevice): Promise<I2CDevice> {
    throw new Error(
      "You cannot add i2c device from REST, connect it instead ;)"
    );
  }
  public async update(_id: number, _data: I2CDevice): Promise<void> {
    throw new Error("I2C devices are read only ;)");
  }
  public async count(filter?: Partial<I2CDevice> | undefined): Promise<number> {
    return await this.inMemoryStore.count(filter);
  }
  public async search<TSelect extends Array<keyof I2CDevice>>(
    filter: SearchOptions<I2CDevice, TSelect>
  ): Promise<Array<PartialResult<I2CDevice, TSelect[number]>>> {
    return await this.inMemoryStore.search(filter);
  }
  public async get(key: number): Promise<I2CDevice | undefined> {
    return await this.inMemoryStore.get(key);
  }
  public async remove(_key: number): Promise<void> {
    throw new Error("Disconnect the device instead :P");
  }
  public dispose() {}

  private readonly logger: ScopedLogger;

  constructor(private readonly injector: Injector) {
    this.logger = this.injector.logger.withScope(this.constructor.name);
    this.read();
  }
}
