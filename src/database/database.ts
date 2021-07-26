import pg from 'pg';

const { Pool } = pg;
let database: string;

if(process.env.NODE_ENV === `test`){
  database = 'singsong_test'
} else {
  database = 'singsong'
}



const user: string = "postgres";
const password: string = "123456";
const host: string = 'localhost';
const port: number = 5432;


const connection = new Pool({
    user,
    password,
    host,
    port,
    database
  });

export default connection;