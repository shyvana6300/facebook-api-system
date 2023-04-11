module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Account;
}