import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { DhtSensor } from "./dht-sensor";

@Entity()
export class DhtValue {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(_d => DhtSensor, d => d, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  public sensor!: DhtSensor;

  @Column({ type: "double" })
  public temperatureCelsius!: number;

  @Column({ type: "double", unique: true })
  humidityPercent!: string;

  @CreateDateColumn()
  timestamp!: Date;
}
