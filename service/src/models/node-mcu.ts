import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { DhtSensor } from "./dht-sensor";

@Entity()
export class NodeMcu {
  @PrimaryColumn({ type: "varchar" })
  public mac!: string;

  @Column({ type: "varchar", unique: true })
  public ip!: string;

  @Column({ type: "varchar", unique: true })
  public displayName!: string;

  @OneToMany(_d => DhtSensor, s => s.nodeMcu)
  public dhtSensors!: DhtSensor[];
}
