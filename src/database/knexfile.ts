import type { Knex } from "knex";

const configKnex: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    debug:true,
    connection: {
        filename: "./database.db", //localização do seu arquivo .db
    },
    useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
    pool: {
        min: 0, // número de conexões, esses valores são os recomendados para sqlite3
        max: 1,
				afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb)
        } // configurando para o knex forçar o check das constrainst FK
      },
    migrations:{
      extension:'ts',
      disableTransactions:true
    }
  },

  staging: {
    client: "sqlite3",
    connection: {
        filename: "./src/database/database.db", //localização do seu arquivo .db
    },
    useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
    pool: {
        min: 0, // número de conexões, esses valores são os recomendados para sqlite3
        max: 1,
				afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb)
        } // configurando para o knex forçar o check das constrainst FK
    }
  },

  production: {
    client: "sqlite3",
    connection: {
        filename: "./src/database/database.db", //localização do seu arquivo .db
    },
    useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
    pool: {
        min: 0, // número de conexões, esses valores são os recomendados para sqlite3
        max: 1,
				afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb)
        } // configurando para o knex forçar o check das constrainst FK
    }
  }
};

export default configKnex;