import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Stair =  sequelize.define("Stair", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    sub_order_id:{
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
        fields: ['id'] 
      },
      {
        fields: ['sub_order_id'] 
      },
    ]
  });

    Stair.associate = (models) => {
        Stair.belongsTo(models.SubOrder, {
        foreignKey: 'sub_order_id',
        as: 'sub_order'
        });
    };
};