import pg from 'pg';

const { Pool } = pg;

const user: string = "postgres";
const password: string = "123456";
const host: string = 'localhost';
const port: number = 5432;
const database: string = 'singsong';

const connection = new Pool({
    user,
    password,
    host,
    port,
    database
  });

export default connection;