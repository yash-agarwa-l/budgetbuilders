import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Builder = sequelize.define("Builder", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id:{
      type: DataTypes.INTEGER,
      reference:{
        model: 'users',
        key: 'id'
      },
      unique:true
    },
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/ 
      }
    },
    name: {
      type: DataTypes.STRING(100), 
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gst_number: {
      type: DataTypes.STRING(15), 
      allowNull: false,
      unique: true,
      validate: {
        len: [15, 15]
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2), 
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5
      }
    },
    years_of_Experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    type: {
      type: DataTypes.ENUM('residential', 'commercial', 'both'), 
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING(512), 
      allowNull: true 
    },
    
  }, {
    underscored: true,
    timestamps: true, 
    paranoid: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      {fields: ['user_id']},
        {
          unique: true,
          fields: ['phone_no']
        },
        {
          unique: true,
          fields: ['gst_number']
        }
      ]
  });

  return Builder;
}