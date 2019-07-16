import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { PirSensor } from "./pir-sensor";

@Entity()
export class PirValue {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(_d => PirSensor, d => d, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  public sensor!: PirSensor;

  @Column({ type: "boolean" })
  public rising!: boolean;

  @CreateDateColumn()
  timestamp!: Date;
}
