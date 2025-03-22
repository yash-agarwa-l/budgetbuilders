import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Room =  sequelize.define("Room", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    sub_order_d:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SubOrders',
            key: 'id'
        }
    },
    no_of_floors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    img_url:{
        type: DataTypes.STRING,
        allowNull: true
    },
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['orderId'] 
      },
      {
        fields: ['createdAt']
      }
    ]
  });
  
    Room.associate = (models) => {
        Room.belongsTo(models.SubOrder, {
        foreignKey: 'sub_order_id',
        as: 'sub_order'
        });
    };
    return Home;
};