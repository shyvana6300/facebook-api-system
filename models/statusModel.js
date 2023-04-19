module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
        imageUrl: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING,
        },
    });

    return Status;
}