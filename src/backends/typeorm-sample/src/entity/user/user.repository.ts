import { DataSource } from "src/data-source";
import { User } from "./user.entity";

export const UserRepository = DataSource.getRepository(User);