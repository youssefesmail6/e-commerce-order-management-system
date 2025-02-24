'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Adding foreign key constraints
    await queryInterface.addConstraint('order_items', {
      fields: ['orderId'],
      type: 'foreign key',
      name: 'fk_order_item_order',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('order_items', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_order_item_product',
      references: {
        table: 'products',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
  },
};
