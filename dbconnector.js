const db = require("./models/baseModel");
function connectDB () {
    // db.sequelize.sync({force: true})
    db.sequelize.sync()
        .then(() => {
            console.log("Database is connected and synced!");
        })
        .catch((err) => {
            console.log("Database connection failed: " + err.message);
        });
}
module.exports = connectDB;
