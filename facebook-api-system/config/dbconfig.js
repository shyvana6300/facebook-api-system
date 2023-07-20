module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.MYSQLDB_USER,
  PASSWORD: process.env.MYSQLDB_ROOT_PASSWORD,
  DB: process.env.MYSQLDB_DATABASE,
  PORT: process.env.MYSQLDB_LOCAL_PORT,
//   HOST: "localhost",
//   USER: "shyvana6300",
//   PASSWORD: "Shyvana@6300",
//   DB: "facebook_api_db",

  dialect: "mysql",
  pool: {
    //maximum number of connection in pool
    max: 5,
    // minimum number of connection in pool
    min: 0,
    // maximum time, in milliseconds, that pool will try to get connection before throwing error
    acquire: 30000,
    // maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000,
  },
};
