export interface InitializePostgresParams {
  host: string;
  port: number | string;
  username: string;
  password: string;
  database: string;
}