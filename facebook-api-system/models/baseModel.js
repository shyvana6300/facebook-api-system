const dbConfig = require('../config/dbconfig');

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
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
db.reactionModel = require("./reactionModel")(sequelize, Sequelize);
db.friendshipModel = require("./friendshipModel")(sequelize, Sequelize);

// Relation account - comment
db.accountModel.hasMany(db.commentModel, {foreignKey: 'idCommenter'});
db.commentModel.belongsTo(db.accountModel, {foreignKey: 'idCommenter'});

// Relation status - comment
db.statusModel.hasMany(db.commentModel, {foreignKey: 'idStatus'});
db.commentModel.belongsTo(db.statusModel, {foreignKey: 'idStatus'});

// Relation account - status
db.accountModel.hasMany(db.statusModel);
db.statusModel.belongsTo(db.accountModel);

// Relation account - reaction
db.accountModel.hasMany(db.reactionModel, {foreignKey: 'idReactor'});
db.reactionModel.belongsTo(db.accountModel, {foreignKey: 'idReactor'});

// Relation status - reaction
db.statusModel.hasMany(db.reactionModel);
db.reactionModel.belongsTo(db.statusModel);

// Relation account - friendship
db.accountModel.hasMany(db.friendshipModel);
db.friendshipModel.belongsTo(db.accountModel);
module.exports = db;