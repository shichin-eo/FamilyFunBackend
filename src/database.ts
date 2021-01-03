require("dotenv").config();
import { Pool } from "pg";

//** Constants */
// const USERNAME_DB = "postgres";
// const PASSWORD_DB = "Qwerty12345";
// //  const HOST_DB = "192.168.244.132";
// //! Domain name ws2016
// const HOST_DB = "donate01server";
// const PORT_DB = 5432;
// const NAME_DB = "familyfun";
//** */

//** Constants .env*/
const USERNAME_DB = process.env.USERNAME_DB;
const PASSWORD_DB = process.env.PASSWORD_DB;
const HOST_DB = process.env.HOST_DB;
const PORT_DB = Number(process.env.PORT_DB);
const NAME_DB = process.env.NAME_DB;
//** */

export const pool = new Pool({
  user: USERNAME_DB,
  host: HOST_DB,
  database: NAME_DB,
  password: PASSWORD_DB,
  port: PORT_DB,
});
