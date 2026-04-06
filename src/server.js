const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');


dotenv.config();


const app = express();


connectDB();


app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '/public/uploads'))); 


const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API NNIT Shop đang hoạt động tốt!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Server đang chạy tại cổng: ${PORT}`);
    console.log(`Bấm vào http://localhost:${PORT}`);
    console.log(`========================================`);
});