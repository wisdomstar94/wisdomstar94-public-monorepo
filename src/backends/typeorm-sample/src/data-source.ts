import { load } from 'dotenv-mono';
import { DataSource as _DataSource } from "typeorm";
import { User } from "./entity/user/user.entity";
import { UserHobby } from './entity/user-hobby/user-hobby.entity';
load();

export const DataSource = new _DataSource({
  type: "postgres",
  host: process.env.POSTGRES_DB_HOST ?? (() => { throw new Error(`process.env.POSTGRES_DB_HOST is undefined.`) })(),
  port: parseInt(process.env.POSTGRES_DB_PORT ?? (() => { throw new Error(`process.env.POSTGRES_DB_PORT is undefined.`) })()),
  username: process.env.POSTGRES_DB_USERNAME ?? (() => { throw new Error(`process.env.POSTGRES_DB_USERNAME is undefined.`) })(),
  password: process.env.POSTGRES_DB_PASSWORD ?? (() => { throw new Error(`process.env.POSTGRES_DB_PASSWORD is undefined.`) })(),
  database: process.env.POSTGRES_DB_DATABASE ?? (() => { throw new Error(`process.env.POSTGRES_DB_DATABASE is undefined.`) })(),
  synchronize: true,
  logging: true,
  entities: [User, UserHobby],
  subscribers: [],
  migrations: [],
});
