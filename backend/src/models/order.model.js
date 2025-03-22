import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_status: {
      type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    total_offered_price: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      validate: {
        min: 0
      }
    },
    closed_price: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: true,
      validate: {
        min: 0
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // tableName: 'orders',
    indexes: [
      { fields: ['order_status'] },
      { fields: ['created_at'] },
      { fields: ['user_id'] }
    ]
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  Order.associate = (models) => {
    Order.hasMany(models.SubOrder, {
      foreignKey: 'order_id',
      as: 'subOrders'
    });
  };

  return Order;
};