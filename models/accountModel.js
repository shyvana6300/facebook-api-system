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
        },
        otpKey: {
            type: Sequelize.STRING
        },
        avatar: {
            type: Sequelize.STRING
        },
        fullName: {
            type: Sequelize.STRING,
        },
        birthDay: {
            type: Sequelize.STRING,
        },
        job: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.STRING,
        },
    });

    return Account;
}