module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'role', {
            type: Sequelize.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'role');
    },
};
