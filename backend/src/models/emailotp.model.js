import { DataTypes } from "sequelize";

export default function (sequelize) {
  const EmailOtp = sequelize.define(
    "EmailOtp",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
        set(value) {
          this.setDataValue("email", String(value).trim().toLowerCase());
        },
      },
      // Only the bcrypt hash is stored, so a database leak does not hand out
      // usable login codes.
      otp_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("customer", "builder", "worker"),
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      consumed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "email_otps",
      paranoid: false,
      indexes: [{ fields: ["email"] }, { fields: ["expires_at"] }],
    },
  );

  return EmailOtp;
}
