module.exports = (sequelize, Sequelize) => {
    const FriendShip = sequelize.define("friendship", {
        idFriend: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });

    return FriendShip;
}