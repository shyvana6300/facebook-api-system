const dbConfig = require('../config/dbconfig');

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
      }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.accountModel = require("./accountModel")(sequelize, Sequelize);
db.statusModel = require("./statusModel")(sequelize, Sequelize);
db.commentModel = require("./commentModel")(sequelize, Sequelize);

db.accountModel.hasMany(db.commentModel);
db.commentModel.belongsTo(db.accountModel);

db.statusModel.hasMany(db.commentModel);
db.commentModel.belongsTo(db.statusModel);

db.accountModel.hasMany(db.statusModel);
db.statusModel.belongsTo(db.accountModel);

module.exports = db;