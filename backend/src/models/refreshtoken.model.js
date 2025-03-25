import { DataTypes } from "sequelize";

export default function (sequelize) {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      // SHA-256 of the issued token. Storing one row per session is what lets
      // us revoke a single device, or all of them, on logout.
      token_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "refresh_tokens",
      paranoid: false,
      indexes: [
        { unique: true, fields: ["token_hash"] },
        { fields: ["user_id"] },
      ],
    },
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  };

  return RefreshToken;
}
