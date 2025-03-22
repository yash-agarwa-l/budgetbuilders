import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Customer = sequelize.define("Customer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: 'users', 
        key: 'id'
      }
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/ 
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(9,6), 
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(8,6), 
      allowNull: false
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidAddress(value) {
          const requiredFields = ['street', 'city', 'state', 'postal_code'];
          if (!requiredFields.every(field => field in value)) {
            throw new Error('Address must contain street, city, state, and postal_code');
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
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['phone_no']
      }
    ]
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  return Customer;
}