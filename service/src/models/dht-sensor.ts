import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { NodeMcu } from "./node-mcu";
import { DhtValue } from "./dht-value";

@Entity()
export class DhtSensor {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(_d => NodeMcu, d => d.dhtSensors, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  public nodeMcu!: NodeMcu;

  @Column({ type: "varchar", length: 2 })
  public dataPin!: string;

  @Column({ type: "varchar", unique: true })
  public displayName!: string;

  @OneToMany(() => DhtValue, v => v.sensor)
  public values!: DhtValue[];
}
