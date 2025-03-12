const mongoose = require('mongoose');
const { env } = require('../environment');

//mongoose
//Local
// async function connect() {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/SAHEAD');
//     console.log('Kết nối MongoDB thành công!');
//   } catch (error) {
//     console.error('Lỗi kết nối MongoDB:', error);
//   }
// }

//Atlas
async function connect() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: env.DATABASE_NAME,
    });
    console.log('✅ Connected to MongoDB Atlas!');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
}

//////////////////////////////////////////////////////////////////////////////
// mongodb node.js driver
// import { MongoClient, ServerApiVersion } from 'mongodb';
// //Khởi tạo trello bằng null vì chưa connect
// let trelloDatabaseInstance = null;

// const client = new MongoClient(MONGODB_URI, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
// //Kết nối database
// export const CONNECT_DB = async () => {
//     //Gọi kết nối tới mongoAtlas với uri đã khai báo
//     await client.connect();
//     //Kết nối thành công thì lấy database theo tên và gán ngược lại biến trello ở trên
//     trelloDatabaseInstance = client.db(DATABASE_NAME)
//   };

// export const GET_DB = (req, res) =>{
//   if(trelloDatabaseInstance === null) {
//     res.status(500).json({ message: 'Database connection not established' });
//     return;
//   }
//   res.json(trelloDatabaseInstance);
// }

module.exports = { connect };
