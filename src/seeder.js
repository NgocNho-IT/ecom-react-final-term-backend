const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

// Nạp biến môi trường
dotenv.config();

const seedData = async () => {
    try {
        // 1. KẾT NỐI DATABASE
        await mongoose.connect(process.env.MONGO_URI);
        console.log('⏳ Đang kết nối Database để làm mới dữ liệu...');

        // 2. LÀM SẠCH DỮ LIỆU
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        console.log('🗑️ Đã dọn dẹp sạch sẽ dữ liệu cũ.');

        // 3. TẠO TÀI KHOẢN (Password: 12345)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('12345', salt);

        await User.create([
            {
                firstName: 'Nhớ',
                lastName: 'Đặng Ngọc',
                phone: '0123456789',
                email: 'admin@nnit.com',
                password: hashedPassword,
                isAdmin: true
            },
            {
                firstName: 'Khách',
                lastName: 'Dùng Thử',
                phone: '0987654321',
                email: 'usertest1@nnit.com',
                password: hashedPassword,
                isAdmin: false
            }
        ]);
        console.log('👤 Đã tạo Admin (admin@nnit.com) và User (usertest1@nnit.com) | Pass: 12345');

        // 4. TẠO DANH MỤC
        const createdCategories = await Category.insertMany([
            { name: 'iPhone' },
            { name: 'Samsung' },
            { name: 'Xiaomi' }
        ]);
        const iphoneId = createdCategories[0]._id;
        const samsungId = createdCategories[1]._id;
        const xiaomiId = createdCategories[2]._id;

        // 5. TẠO 12 SẢN PHẨM THEO ẢNH
        const productsData = [
            // --- IPHONE ---
            {
                name: 'iPhone 13 mini',
                category: iphoneId,
                description: 'Kích thước nhỏ gọn, hiệu năng cực lớn với chip A15.',
                image: 'uploads/iPhone_13_mini.webp',
                specs: { screen: '5.4 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '2438 mAh' },
                variants: [{ colorName: 'Hồng', colorHex: '#fad2da', storageCapacity: '128GB', network: '5G', price: 14990000, isSale: true, salePrice: 13500000, stock: 20 }]
            },
            {
                name: 'iPhone 14 Pro',
                category: iphoneId,
                description: 'Dynamic Island đột phá, camera 48MP siêu sắc nét.',
                image: 'uploads/iPhone_14_Pro.webp',
                specs: { screen: '6.1 inch', os: 'iOS 16', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '3200 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#5c4d5c', storageCapacity: '256GB', network: '5G', price: 24990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'iPhone 15 Plus',
                category: iphoneId,
                description: 'Màn hình lớn, Dynamic Island và cổng sạc USB-C mới.',
                image: 'uploads/iPhone_15_Plus.webp',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '4383 mAh' },
                variants: [{ colorName: 'Xanh dương', colorHex: '#d2e3f0', storageCapacity: '128GB', network: '5G', price: 23990000, isSale: true, salePrice: 22500000, stock: 30 }]
            },
            {
                name: 'iPhone 15 Pro Max',
                category: iphoneId,
                description: 'Khung Titan bền bỉ, chip A17 Pro chơi game đỉnh cao.',
                image: 'uploads/iPhone_15_Pro_Max.webp',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A17 Pro', battery: '4422 mAh' },
                variants: [{ colorName: 'Titan Tự Nhiên', colorHex: '#cfc8bc', storageCapacity: '256GB', network: '5G', price: 30990000, isSale: true, salePrice: 29500000, stock: 25 }]
            },

            // --- SAMSUNG ---
            {
                name: 'Samsung Galaxy M54',
                category: samsungId,
                description: 'Pin khủng 6000mAh, màn hình Super AMOLED 120Hz.',
                image: 'uploads/Samsung_Galaxy_M54.webp',
                specs: { screen: '6.7 inch', os: 'Android 13', cameraBack: '108MP', cameraFront: '32MP', cpu: 'Exynos 1380', battery: '6000 mAh' },
                variants: [{ colorName: 'Xanh', colorHex: '#2e4a7d', storageCapacity: '128GB', network: '5G', price: 8990000, isSale: false, salePrice: 0, stock: 50 }]
            },
            {
                name: 'Samsung Galaxy S23 FE',
                category: samsungId,
                description: 'Trải nghiệm flagship giá hợp lý, camera 50MP.',
                image: 'uploads/Samsung_Galaxy_S23_FE.webp',
                specs: { screen: '6.4 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '10MP', cpu: 'Exynos 2200', battery: '4500 mAh' },
                variants: [{ colorName: 'Mint', colorHex: '#b2f2bb', storageCapacity: '128GB', network: '5G', price: 12990000, isSale: true, salePrice: 11500000, stock: 40 }]
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                category: samsungId,
                description: 'Quyền năng Galaxy AI, bút S Pen và zoom 100x.',
                image: 'uploads/Samsung_Galaxy_S24_Ultra.webp',
                specs: { screen: '6.8 inch', os: 'Android 14', cameraBack: '200MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 3', battery: '5000 mAh' },
                variants: [{ colorName: 'Xám Titan', colorHex: '#8e8e8e', storageCapacity: '256GB', network: '5G', price: 29990000, isSale: true, salePrice: 28500000, stock: 15 }]
            },
            {
                name: 'Samsung Galaxy Z Flip5',
                category: samsungId,
                description: 'Màn hình ngoài Flex Window cực lớn, gập mở cá tính.',
                image: 'uploads/Samsung_Galaxy_Z_Flip5.webp',
                specs: { screen: '6.7 inch', os: 'Android 13', cameraBack: '12MP', cameraFront: '10MP', cpu: 'Snapdragon 8 Gen 2', battery: '3700 mAh' },
                variants: [{ colorName: 'Xanh Mint', colorHex: '#98ff98', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 10 }]
            },

            // --- XIAOMI ---
            {
                name: 'Xiaomi 14 Pro',
                category: xiaomiId,
                description: 'Camera Leica đỉnh cao, HyperOS mượt mà.',
                image: 'uploads/Xiaomi_14_Pro.webp',
                specs: { screen: '6.73 inch', os: 'HyperOS', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '4880 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '512GB', network: '5G', price: 21990000, isSale: true, salePrice: 20500000, stock: 12 }]
            },
            {
                name: 'Xiaomi Poco F5 Pro',
                category: xiaomiId,
                description: 'Siêu phẩm gaming, màn hình 2K cực nét.',
                image: 'uploads/Xiaomi_Poco_F5_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 13', cameraBack: '64MP', cameraFront: '16MP', cpu: 'Snapdragon 8+ Gen 1', battery: '5160 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '256GB', network: '5G', price: 11990000, isSale: false, salePrice: 0, stock: 35 }]
            },
            {
                name: 'Xiaomi Redmi 13C',
                category: xiaomiId,
                description: 'Giá cực rẻ, pin trâu, thiết kế trẻ trung.',
                image: 'uploads/Xiaomi_Redmi_13C.webp',
                specs: { screen: '6.74 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '8MP', cpu: 'Helio G85', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '128GB', network: '4G', price: 3090000, isSale: true, salePrice: 2890000, stock: 100 }]
            },
            {
                name: 'Xiaomi Redmi Note 13 Pro',
                category: xiaomiId,
                description: 'Camera 200MP siêu nét, sạc nhanh thần tốc.',
                image: 'uploads/Xiaomi_Redmi_Note_13_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 13', cameraBack: '200MP', cameraFront: '16MP', cpu: 'Helio G99 Ultra', battery: '5000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#d8bfd8', storageCapacity: '256GB', network: '4G', price: 7990000, isSale: false, salePrice: 0, stock: 45 }]
            }
        ];

        await Product.insertMany(productsData);
        console.log(`✅ Thành công! Đã bơm ${productsData.length} sản phẩm tương ứng với ảnh của Nhớ.`);

        process.exit();
    } catch (error) {
        console.error('❌ Lỗi Seeder:', error);
        process.exit(1);
    }
};

seedData();