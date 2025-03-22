import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Home =  sequelize.define("Home", {
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
    no_of_rooms_per_floor: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidStructure(value) {
          if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Must be a key-value object');
          }
          for (const [floor, rooms] of Object.entries(value)) {
            if (isNaN(floor) || isNaN(rooms)) {
              throw new Error('Both keys and values must be numbers');
            }
            if (rooms < 1) {
              throw new Error('Each floor must have at least 1 room');
            }
          }
        }
      }
    },
    area:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
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
    
        Home.associate = (models) => {
            Home.belongsTo(models.SubOrder, {
            foreignKey: 'sub_order_id',
            as: 'sub_order'
            });
        };
        return Home;

        
};