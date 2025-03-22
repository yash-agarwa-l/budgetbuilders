import { DataTypes } from "sequelize";

export default function(sequelize) {
  const SubOrder = sequelize.define("SubOrder", {
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
    expected_price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('house', 'stairs', 'room', 'ceiling', 'other'),
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        validateDetails(value) {
          const validators = {
            house: ['no_of_floors', 'no_of_rooms_per_floor', 'area'],
            stairs: ['height', 'no_of_floors', 'area'],
            room: ['room_type', 'area'],
            ceiling: ['area']
          };
          
          if (this.type && !validators[this.type].every(field => field in value)) {
            throw new Error(`Missing required fields for ${this.type}`);
          }
        }
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      { fields: ['order_id'] },
      { fields: ['created_at'] }
    ]
  });

  SubOrder.associate = (models) => {
    SubOrder.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  };

  return SubOrder;
};