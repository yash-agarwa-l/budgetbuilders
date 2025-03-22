
import { refreshToken } from "firebase-admin/app";
import { DataTypes } from "sequelize";
import jwt from 'jsonwebtoken';

export default function(sequelize) {
  const User =  sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/ 
      }
    },
    type:{
      type:DataTypes.ENUM('customer','builder'),
      allowNull:true

    },
    is_details:{
      type:DataTypes.BOOLEAN,
      default:false,
      // allowNull:false
    },
    refreshToken:{
      type:DataTypes.STRING,
      allowNull:true,
      unique:true
    }
  },{
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      { fields: ['id'] },
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });

    User.hasOne(models.Customer, {
      foreignKey: 'user_id',
      as: 'customer',
      hooks: true, 
      onDelete: 'CASCADE' 
    });

  };
  User.prototype.generateAccessToken = function() {
        return jwt.sign(
          {
    
              id: this.id,
              phoneNo: this.phone_no
          },
          process.env.ACCESS_SECRET,
          {
              expiresIn:process.env.ACCESS_EXPIRY|| "1d"
          }
          
      )
      };
    
      User.prototype.generateRefreshToken = function() {
        return jwt.sign(
          {
            id: this.id,
            phoneNo: this.phone_no
          },
          process.env.REFRESH_SECRET,
          {
              expiresIn:process.env.REFRESH_EXPIRY|| "20d"
          }
          
      )
    }
  return User;
};