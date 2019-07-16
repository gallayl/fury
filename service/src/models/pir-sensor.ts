import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { NodeMcu } from "./node-mcu";
import { PirValue } from "./pir-value";

@Entity()
export class PirSensor {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(_d => NodeMcu, d => d.pirSensors, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  public nodeMcu!: NodeMcu;

  @Column({ type: "varchar", length: 2 })
  public dataPin!: string;

  @Column({ type: "varchar", unique: true })
  public displayName!: string;

  @OneToMany(() => PirValue, v => v.sensor)
  public values!: PirValue[];
}
