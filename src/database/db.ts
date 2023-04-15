import knex, {  } from "knex";
import configKnex from "./knexfile";

 export const Db=knex(configKnex["development"]);