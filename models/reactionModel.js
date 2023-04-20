module.exports = (sequelize, Sequelize) => {
    const Reaction = sequelize.define("reaction");

    return Reaction;
}