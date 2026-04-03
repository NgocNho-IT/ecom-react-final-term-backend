const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // THÊM DÒNG NÀY ĐỂ HẾT LỖI "path is not defined"
const connectDB = require('./config/db');

// Đọc file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối Cơ sở dữ liệu
connectDB();

// Middleware
app.use(cors()); // Cho phép Frontend (React) gọi API
app.use(express.json()); // Đọc được dữ liệu JSON gửi lên từ req.body

// --- PHẦN CẤU HÌNH FILE TĨNH (STATIC FILES) ---
// Giúp Nhớ truy cập ảnh qua link: http://localhost:5000/uploads/ten-anh.jpg
// Chú ý: Đảm bảo Nhớ đã tạo thư mục e-commerce/backend/public/uploads
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads'))); 

// Import các Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Định tuyến API
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);

// Route mặc định
app.get('/', (req, res) => {
    res.send('API NNIT Shop đang hoạt động tốt!');
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Server đang chạy tại cổng: ${PORT}`);
    console.log(`👉 Bấm vào http://localhost:${PORT}`);
    console.log(`========================================`);
});