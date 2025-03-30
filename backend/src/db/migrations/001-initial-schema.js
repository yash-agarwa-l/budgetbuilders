import { DataTypes } from "sequelize";

const timestamps = {
  created_at: { type: DataTypes.DATE, allowNull: false },
  updated_at: { type: DataTypes.DATE, allowNull: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
};

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    role: {
      type: DataTypes.ENUM("customer", "builder", "worker"),
      allowNull: false,
    },
    is_details: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email_verified_at: { type: DataTypes.DATE, allowNull: true },
    ...timestamps,
  });
  await queryInterface.addIndex("users", ["role"]);

  await queryInterface.createTable("email_otps", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    otp_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("customer", "builder", "worker"),
      allowNull: true,
    },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    consumed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await queryInterface.addIndex("email_otps", ["email"]);
  await queryInterface.addIndex("email_otps", ["expires_at"]);

  await queryInterface.createTable("refresh_tokens", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    token_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    revoked_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
  await queryInterface.addIndex("refresh_tokens", ["user_id"]);

  await queryInterface.createTable("customers", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    phone_no: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    address: { type: DataTypes.STRING(255), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    ...timestamps,
  });
  await queryInterface.addIndex("customers", ["user_id"]);

  await queryInterface.createTable("builders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    phone_no: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    address: { type: DataTypes.STRING(255), allowNull: false },
    gst_number: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    years_of_Experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM("residential", "commercial", "both"),
      allowNull: false,
    },
    ...timestamps,
  });

  await queryInterface.createTable("orders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    order_status: {
      type: DataTypes.ENUM("pending", "accepted", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    total_offered_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    closed_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    ...timestamps,
  });
  await queryInterface.addIndex("orders", ["order_status"]);
  await queryInterface.addIndex("orders", ["user_id"]);
  await queryInterface.addIndex("orders", ["created_at"]);

  await queryInterface.createTable("sub_orders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "orders", key: "id" },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM("house", "stairs", "room", "ceiling", "other"),
      allowNull: false,
    },
    expected_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    img_url: { type: DataTypes.STRING, allowNull: true },
    details: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ...timestamps,
  });
  await queryInterface.addIndex("sub_orders", ["order_id"]);

  await queryInterface.createTable("interested_builders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "orders", key: "id" },
      onDelete: "CASCADE",
    },
    builder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "builders", key: "id" },
      onDelete: "CASCADE",
    },
    bid_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    bid_status: {
      type: DataTypes.ENUM("pending", "ongoing", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    ...timestamps,
  });
  await queryInterface.addIndex("interested_builders", ["order_id"]);
  await queryInterface.addIndex("interested_builders", ["builder_id"]);
  await queryInterface.addIndex("interested_builders", ["bid_status"]);
  await queryInterface.addIndex("interested_builders", {
    fields: ["order_id", "builder_id"],
    unique: true,
    name: "interested_builders_order_builder_unique",
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("interested_builders");
  await queryInterface.dropTable("sub_orders");
  await queryInterface.dropTable("orders");
  await queryInterface.dropTable("builders");
  await queryInterface.dropTable("customers");
  await queryInterface.dropTable("refresh_tokens");
  await queryInterface.dropTable("email_otps");
  await queryInterface.dropTable("users");

  for (const enumName of [
    "enum_users_role",
    "enum_email_otps_role",
    "enum_builders_type",
    "enum_orders_order_status",
    "enum_sub_orders_type",
    "enum_interested_builders_bid_status",
  ]) {
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}";`);
  }
}
