require('dotenv').config({path:__dirname+'/./../'});

console.log("------" + process.env.BASE_URL);
module.exports = {
    BASE_URL: process.env.BASE_URL,
    DB_HOST: process.env.DB_HOST,
    MYSQLDB_USER: process.env.MYSQLDB_USER,
    MYSQLDB_ROOT_PASSWORD: process.env.MYSQLDB_ROOT_PASSWORD,
    MYSQLDB_DATABASE: process.env.MYSQLDB_DATABASE,
    MYSQLDB_LOCAL_PORT: process.env.MYSQLDB_LOCAL_PORT,
    MYSQLDB_DOCKER_PORT: process.env.MYSQLDB_DOCKER_PORT,
    NODE_DOCKER_PORT: process.env.NODE_DOCKER_PORT,
}