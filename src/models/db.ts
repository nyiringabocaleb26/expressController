import { createPool } from "mysql2/promise";

export const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"my_project",
    port:3306,
    connectionLimit:10
});
