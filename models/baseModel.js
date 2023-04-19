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

db.accountModel.hasMany(db.commentModel, {foreignKey: 'idCommenter'});
db.commentModel.belongsTo(db.accountModel, {foreignKey: 'idCommenter'});

db.statusModel.hasMany(db.commentModel, {foreignKey: 'idStatus'});
db.commentModel.belongsTo(db.statusModel, {foreignKey: 'idStatus'});

db.accountModel.hasMany(db.statusModel);
db.statusModel.belongsTo(db.accountModel);

module.exports = db;