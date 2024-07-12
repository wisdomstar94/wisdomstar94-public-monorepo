import { load } from 'dotenv-mono';
import { DataSource } from './data-source';
load();

export async function initializePostgres() {
  return DataSource.initialize();
}