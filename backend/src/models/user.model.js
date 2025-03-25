import { DataTypes } from "sequelize";

export default function (sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value) {
          this.setDataValue("email", String(value).trim().toLowerCase());
        },
      },
      role: {
        type: DataTypes.ENUM("customer", "builder", "worker"),
        allowNull: false,
      },
      is_details: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      indexes: [{ unique: true, fields: ["email"] }, { fields: ["role"] }],
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
    User.hasOne(models.Customer, {
      foreignKey: "user_id",
      as: "customer",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Builder, {
      foreignKey: "user_id",
      as: "builder",
      onDelete: "CASCADE",
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: "user_id",
      as: "refreshTokens",
    });
  };

  return User;
}
