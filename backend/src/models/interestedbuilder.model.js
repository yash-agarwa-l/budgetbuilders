import { DataTypes } from "sequelize";

export default function(sequelize) {
  const InterestedBuilder= sequelize.define("InterestedBuilder", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders', 
        key: 'id'
      }
    },
    builder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'builders', 
        key: 'id'
      }
    },
    bid_amount: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      validate: {
        min: 0
      }
    },
    bid_status: {
      type: DataTypes.ENUM('pending', 'ongoing','accepted', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
  }, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    timestamps: true, 
    paranoid: true,
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['builder_id']
      },
      {
        fields: ['bid_status']
      }
    ]
  });

  InterestedBuilder.associate = (models) => {
    InterestedBuilder.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
    InterestedBuilder.belongsTo(models.Builder, {
      foreignKey: 'builder_id',
      as: 'builder'
    });
  }
  return InterestedBuilder;
}