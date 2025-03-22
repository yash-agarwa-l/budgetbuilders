import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
});

const connectdb = async () => {
  try{
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync();
    console.log('Database synced successfully');
    
  }catch(err){
    console.log('Error: ', err);
  }
}

export default sequelize;

// // db/db.js
// import { Sequelize } from 'sequelize';
// import config from '../config/config.js';

// const env = process.env.NODE_ENV || 'development';
// const { database, username, password, host, dialect } = config[env];

// const sequelize = new Sequelize(database, username, password, {
//   host,
//   dialect,
//   logging: false,
//   define: {
//     timestamps: true,
//     paranoid: true,
//     underscored: true
//   }
// });

// export default sequelize;