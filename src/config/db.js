const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Kết nối tới MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Thành công] MongoDB đã kết nối: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Lỗi kết nối MongoDB]: ${error.message}`);
        process.exit(1); // Dừng server nếu lỗi DB
    }
};

module.exports = connectDB;