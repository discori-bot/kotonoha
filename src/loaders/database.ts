import { type JsonMap } from '@iarna/toml';
import { Pool } from 'pg';

const loadDatabase = (database: JsonMap) => new Pool(database);

export default loadDatabase;
