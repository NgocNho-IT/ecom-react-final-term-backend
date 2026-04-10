const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Nhớ đảm bảo đường dẫn này đúng với cấu trúc thư mục của bạn nhé
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đang kết nối Database để làm mới dữ liệu...');

        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        console.log('Đã dọn dẹp sạch sẽ dữ liệu cũ.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('12345', salt);

        // ==========================================
        // 1. TẠO TÀI KHOẢN ADMIN & 5 KHÁCH HÀNG
        // ==========================================
        await User.create([
            {
                firstName: 'Nhớ', lastName: 'Đặng Ngọc', phone: '0123456789',
                email: 'admin@nnit.com', password: hashedPassword, isAdmin: true
            },
            {
                firstName: 'Thành', lastName: 'Long', phone: '0987654321',
                email: 'khach1@nnit.com', password: hashedPassword, isAdmin: false
            },
            {
                firstName: 'Thanh', lastName: 'Trúc', phone: '0987654322',
                email: 'khach2@nnit.com', password: hashedPassword, isAdmin: false
            },
            {
                firstName: 'Hoàng', lastName: 'Nam', phone: '0987654323',
                email: 'khach3@nnit.com', password: hashedPassword, isAdmin: false
            },
            {
                firstName: 'Minh', lastName: 'Anh', phone: '0987654324',
                email: 'khach4@nnit.com', password: hashedPassword, isAdmin: false
            },
            {
                firstName: 'Bảo', lastName: 'Ngọc', phone: '0987654325',
                email: 'khach5@nnit.com', password: hashedPassword, isAdmin: false
            }
        ]);
        console.log('Đã tạo Admin và 5 tài khoản Khách hàng | Pass mặc định: 12345');

        // ==========================================
        // 2. TẠO 5 DANH MỤC (THÊM VIVO, OPPO)
        // ==========================================
        const createdCategories = await Category.insertMany([
            { name: 'iPhone' },
            { name: 'Samsung' },
            { name: 'Xiaomi' },
            { name: 'Vivo' },
            { name: 'Oppo' }
        ]);
        
        const iphoneId = createdCategories[0]._id;
        const samsungId = createdCategories[1]._id;
        const xiaomiId = createdCategories[2]._id;
        const vivoId = createdCategories[3]._id;
        const oppoId = createdCategories[4]._id;

        // ==========================================
        // 3. TẠO SẢN PHẨM (ĐỘI HÌNH SIÊU FLAGSHIP)
        // ==========================================
        const productsData = [
            // ------------------ IPHONE (12 MÁY - Giữ nguyên ảnh) ------------------
            {
                name: 'iPhone 13 mini', category: iphoneId,
                description: 'Kích thước nhỏ gọn, hiệu năng cực lớn với chip A15.',
                image: 'uploads/iphone_13_mini-1775439913108.png',
                specs: { screen: '5.4 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '2438 mAh' },
                variants: [{ colorName: 'Hồng', colorHex: '#fad2da', storageCapacity: '128GB', network: '5G', price: 14990000, isSale: true, salePrice: 13500000, stock: 20 }]
            },
            {
                name: 'iPhone 14 Pro', category: iphoneId,
                description: 'Dynamic Island đột phá, camera 48MP siêu sắc nét.',
                image: 'uploads/iPhone_14_Pro.webp',
                specs: { screen: '6.1 inch', os: 'iOS 16', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '3200 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#5c4d5c', storageCapacity: '256GB', network: '5G', price: 24990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'iPhone 15 Plus', category: iphoneId,
                description: 'Màn hình lớn, Dynamic Island và cổng sạc USB-C mới.',
                image: 'uploads/iphone-15-plus-1775439515113.png',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '4383 mAh' },
                variants: [{ colorName: 'Xanh dương', colorHex: '#d2e3f0', storageCapacity: '128GB', network: '5G', price: 23990000, isSale: true, salePrice: 22500000, stock: 30 }]
            },
            {
                name: 'iPhone 15 Pro Max', category: iphoneId,
                description: 'Khung Titan bền bỉ, chip A17 Pro chơi game đỉnh cao.',
                image: 'uploads/iphone-15-pro-max-1775440055796.png',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A17 Pro', battery: '4422 mAh' },
                variants: [{ colorName: 'Titan Tự Nhiên', colorHex: '#cfc8bc', storageCapacity: '256GB', network: '5G', price: 30990000, isSale: true, salePrice: 29500000, stock: 25 }]
            },
            {
                name: 'iPhone 11', category: iphoneId,
                description: 'Sự lựa chọn quốc dân với giá thành cực kỳ dễ tiếp cận.',
                image: 'uploads/iphone-11-1775439539175.png',
                specs: { screen: '6.1 inch', os: 'iOS 13', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A13', battery: '3110 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '64GB', network: '4G', price: 9990000, isSale: true, salePrice: 8500000, stock: 40 }]
            },
            {
                name: 'iPhone 12', category: iphoneId,
                description: 'Thiết kế vuông vức thời thượng, màn hình OLED sắc nét.',
                image: 'uploads/iphone-12-1775437846524.jpg',
                specs: { screen: '6.1 inch', os: 'iOS 14', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A14', battery: '2815 mAh' },
                variants: [{ colorName: 'Xanh Mint', colorHex: '#98ff98', storageCapacity: '128GB', network: '5G', price: 12990000, isSale: false, salePrice: 0, stock: 35 }]
            },
            {
                name: 'iPhone 13', category: iphoneId,
                description: 'Cụm camera chéo đặc trưng, pin trâu hơn thế hệ trước.',
                image: 'uploads/iphone-13-1775439138510.png',
                specs: { screen: '6.1 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3240 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '128GB', network: '5G', price: 14990000, isSale: true, salePrice: 13990000, stock: 50 }]
            },
            {
                name: 'iPhone 13 Pro', category: iphoneId,
                description: 'Màn hình ProMotion 120Hz mượt mà, camera Macro siêu đỉnh.',
                image: 'uploads/iphone-13-pro-1775439153286.webp',
                specs: { screen: '6.1 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3095 mAh' },
                variants: [{ colorName: 'Xanh Sierra', colorHex: '#a0b1c0', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'iPhone 14', category: iphoneId,
                description: 'Nâng cấp RAM và camera trước, hỗ trợ liên lạc vệ tinh.',
                image: 'uploads/iphone-14-1775439189287.png',
                specs: { screen: '6.1 inch', os: 'iOS 16', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3279 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffeb3b', storageCapacity: '128GB', network: '5G', price: 18490000, isSale: true, salePrice: 17500000, stock: 22 }]
            },
            {
                name: 'iPhone 14 Plus', category: iphoneId,
                description: 'Màn hình khổng lồ 6.7 inch với thời lượng pin kỷ lục.',
                image: 'uploads/iphone-14-plus-1775439202589.webp',
                specs: { screen: '6.7 inch', os: 'iOS 16', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '4325 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#e6e6fa', storageCapacity: '256GB', network: '5G', price: 21990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'iPhone 15', category: iphoneId,
                description: 'Thiết kế mặt lưng nhám, Dynamic Island và camera 48MP.',
                image: 'uploads/iphone-15-1775439219453.webp',
                specs: { screen: '6.1 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '3349 mAh' },
                variants: [{ colorName: 'Hồng', colorHex: '#ffb6c1', storageCapacity: '128GB', network: '5G', price: 20990000, isSale: true, salePrice: 19500000, stock: 45 }]
            },
            {
                name: 'iPhone 15 Pro', category: iphoneId,
                description: 'Sức mạnh Pro trong thiết kế nhỏ gọn, viền Titan siêu nhẹ.',
                image: 'uploads/iphone-15-pro-1775440147044.webp',
                specs: { screen: '6.1 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A17 Pro', battery: '3274 mAh' },
                variants: [{ colorName: 'Titan Xanh', colorHex: '#4b5363', storageCapacity: '256GB', network: '5G', price: 27990000, isSale: false, salePrice: 0, stock: 20 }]
            },

            // ------------------ SAMSUNG (12 MÁY - Giữ nguyên ảnh) ------------------
            {
                name: 'Samsung Galaxy M54', category: samsungId,
                description: 'Pin khủng 6000mAh, màn hình Super AMOLED 120Hz.',
                image: 'uploads/Samsung_Galaxy_M54.webp',
                specs: { screen: '6.7 inch', os: 'Android 13', cameraBack: '108MP', cameraFront: '32MP', cpu: 'Exynos 1380', battery: '6000 mAh' },
                variants: [{ colorName: 'Xanh', colorHex: '#2e4a7d', storageCapacity: '128GB', network: '5G', price: 8990000, isSale: false, salePrice: 0, stock: 50 }]
            },
            {
                name: 'Samsung Galaxy S23 FE', category: samsungId,
                description: 'Trải nghiệm flagship giá hợp lý, camera 50MP.',
                image: 'uploads/Samsung_Galaxy_S23_FE.webp',
                specs: { screen: '6.4 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '10MP', cpu: 'Exynos 2200', battery: '4500 mAh' },
                variants: [{ colorName: 'Mint', colorHex: '#b2f2bb', storageCapacity: '128GB', network: '5G', price: 12990000, isSale: true, salePrice: 11500000, stock: 40 }]
            },
            {
                name: 'Samsung Galaxy S24 Ultra', category: samsungId,
                description: 'Quyền năng Galaxy AI, bút S Pen và zoom 100x.',
                image: 'uploads/Samsung_Galaxy_S24_Ultra.webp',
                specs: { screen: '6.8 inch', os: 'Android 14', cameraBack: '200MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 3', battery: '5000 mAh' },
                variants: [{ colorName: 'Xám Titan', colorHex: '#8e8e8e', storageCapacity: '256GB', network: '5G', price: 29990000, isSale: true, salePrice: 28500000, stock: 15 }]
            },
            {
                name: 'Samsung Galaxy Z Flip5', category: samsungId,
                description: 'Màn hình ngoài Flex Window cực lớn, gập mở cá tính.',
                image: 'uploads/samsung-galaxy-z-flip5-1775439256618.webp',
                specs: { screen: '6.7 inch', os: 'Android 13', cameraBack: '12MP', cameraFront: '10MP', cpu: 'Snapdragon 8 Gen 2', battery: '3700 mAh' },
                variants: [{ colorName: 'Xanh Mint', colorHex: '#98ff98', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 10 }]
            },
            {
                name: 'Samsung Galaxy S23', category: samsungId,
                description: 'Thiết kế tinh giản, sức mạnh Snapdragon 8 Gen 2.',
                image: 'uploads/samsung-galaxy-s23-1775439283329.webp',
                specs: { screen: '6.1 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 2', battery: '3900 mAh' },
                variants: [{ colorName: 'Kem', colorHex: '#f5f5dc', storageCapacity: '128GB', network: '5G', price: 16990000, isSale: true, salePrice: 15500000, stock: 25 }]
            },
            {
                name: 'Samsung Galaxy S23 Plus', category: samsungId,
                description: 'Màn hình lớn hơn, giải trí và làm việc đã hơn.',
                image: 'uploads/samsung-galaxy-s23-plus-1775439318101.webp',
                specs: { screen: '6.6 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 2', battery: '4700 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 20990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'Samsung Galaxy S24', category: samsungId,
                description: 'Định nghĩa lại điện thoại với trí tuệ nhân tạo Galaxy AI.',
                image: 'uploads/samsung-galaxy-s24-1775436892555.webp',
                specs: { screen: '6.2 inch', os: 'Android 14', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Exynos 2400', battery: '4000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#800080', storageCapacity: '256GB', network: '5G', price: 22990000, isSale: true, salePrice: 21500000, stock: 35 }]
            },
            {
                name: 'Samsung Galaxy S24 Plus', category: samsungId,
                description: 'Màn hình Quad HD+ cực sắc nét, AI thông minh mọi lúc.',
                image: 'uploads/samsung-galaxy-s24-plus-1775439396309.webp',
                specs: { screen: '6.7 inch', os: 'Android 14', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Exynos 2400', battery: '4900 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffd700', storageCapacity: '256GB', network: '5G', price: 25990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Samsung Galaxy Z Fold5', category: samsungId,
                description: 'Siêu phẩm màn hình gập, bản lề Flex khít hoàn toàn.',
                image: 'uploads/samsung-galaxy-z-fold5-1775439411028.webp',
                specs: { screen: '7.6 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '10MP', cpu: 'Snapdragon 8 Gen 2', battery: '4400 mAh' },
                variants: [{ colorName: 'Xanh Icy', colorHex: '#aed9e0', storageCapacity: '512GB', network: '5G', price: 35990000, isSale: true, salePrice: 33500000, stock: 12 }]
            },
            {
                name: 'Samsung Galaxy A54', category: samsungId,
                description: 'Thiết kế lấy cảm hứng từ dòng S, mặt lưng kính sang trọng.',
                image: 'uploads/samsung-galaxy-a54-1775439423544.webp',
                specs: { screen: '6.4 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Exynos 1380', battery: '5000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#d8bfd8', storageCapacity: '128GB', network: '5G', price: 8490000, isSale: false, salePrice: 0, stock: 60 }]
            },
            {
                name: 'Samsung Galaxy A34', category: samsungId,
                description: 'Cấu hình mạnh mẽ, chống nước bụi IP67.',
                image: 'uploads/samsung-galaxy-a34-1775439437360.webp',
                specs: { screen: '6.6 inch', os: 'Android 13', cameraBack: '48MP', cameraFront: '13MP', cpu: 'Dimensity 1080', battery: '5000 mAh' },
                variants: [{ colorName: 'Bạc', colorHex: '#c0c0c0', storageCapacity: '128GB', network: '5G', price: 6590000, isSale: true, salePrice: 5990000, stock: 55 }]
            },
            {
                name: 'Samsung Galaxy S22 Ultra', category: samsungId,
                description: 'Mẫu flagship thiết kế vuông vắn, bút S Pen tích hợp.',
                image: 'uploads/samsung-galaxy-s22-ultra-1775439448497.webp',
                specs: { screen: '6.8 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '40MP', cpu: 'Snapdragon 8 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Đỏ', colorHex: '#8b0000', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: false, salePrice: 0, stock: 15 }]
            },

            // ------------------ XIAOMI (12 MÁY - Giữ nguyên ảnh) ------------------
            {
                name: 'Xiaomi 14 Pro', category: xiaomiId,
                description: 'Camera Leica đỉnh cao, HyperOS mượt mà.',
                image: 'uploads/xiaomi_14_pro-1775440192803.webp',
                specs: { screen: '6.73 inch', os: 'HyperOS', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '4880 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '512GB', network: '5G', price: 21990000, isSale: true, salePrice: 20500000, stock: 12 }]
            },
            {
                name: 'Xiaomi Poco F5 Pro', category: xiaomiId,
                description: 'Siêu phẩm gaming, màn hình 2K cực nét.',
                image: 'uploads/Xiaomi_Poco_F5_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 13', cameraBack: '64MP', cameraFront: '16MP', cpu: 'Snapdragon 8+ Gen 1', battery: '5160 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '256GB', network: '5G', price: 11990000, isSale: false, salePrice: 0, stock: 35 }]
            },
            {
                name: 'Xiaomi Redmi 13C', category: xiaomiId,
                description: 'Giá cực rẻ, pin trâu, thiết kế trẻ trung.',
                image: 'uploads/xiaomi-redmi-13c-1775439460841.webp',
                specs: { screen: '6.74 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '8MP', cpu: 'Helio G85', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '128GB', network: '4G', price: 3090000, isSale: true, salePrice: 2890000, stock: 100 }]
            },
            {
                name: 'Xiaomi Redmi Note 13 Pro', category: xiaomiId,
                description: 'Camera 200MP siêu nét, sạc nhanh thần tốc.',
                image: 'uploads/Xiaomi_Redmi_Note_13_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 13', cameraBack: '200MP', cameraFront: '16MP', cpu: 'Helio G99 Ultra', battery: '5000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#d8bfd8', storageCapacity: '256GB', network: '4G', price: 7990000, isSale: false, salePrice: 0, stock: 45 }]
            },
            {
                name: 'Xiaomi 14', category: xiaomiId,
                description: 'Flagship nhỏ gọn, viền siêu mỏng, hiệu năng dẫn đầu.',
                image: 'uploads/xiaomi-14-1775439474184.webp',
                specs: { screen: '6.36 inch', os: 'HyperOS', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '4610 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: true, salePrice: 17500000, stock: 25 }]
            },
            {
                name: 'Xiaomi 13', category: xiaomiId,
                description: 'Camera tinh chỉnh bởi Leica, thiết kế viền vuông.',
                image: 'uploads/xiaomi-13-1775439488773.webp',
                specs: { screen: '6.36 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '4500 mAh' },
                variants: [{ colorName: 'Xanh Flora', colorHex: '#a0db8e', storageCapacity: '256GB', network: '5G', price: 15990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Xiaomi 13 Pro', category: xiaomiId,
                description: 'Màn hình cong tràn viền, cảm biến camera 1 inch.',
                image: 'uploads/xiaomi-13-pro-1775439501904.webp',
                specs: { screen: '6.73 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '4820 mAh' },
                variants: [{ colorName: 'Đen Gốm', colorHex: '#1a1a1a', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: true, salePrice: 18500000, stock: 15 }]
            },
            {
                name: 'Xiaomi Redmi Note 12', category: xiaomiId,
                description: 'Màn hình AMOLED 120Hz mượt mà nhất phân khúc.',
                image: 'uploads/xiaomi-redmi-note-12-1775436919352.jpg',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '13MP', cpu: 'Snapdragon 4 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh Băng', colorHex: '#b2ffff', storageCapacity: '128GB', network: '4G', price: 4490000, isSale: false, salePrice: 0, stock: 80 }]
            },
            {
                name: 'Xiaomi Redmi Note 12 Pro', category: xiaomiId,
                description: 'Sạc nhanh 67W, chip Dimensity xử lý mượt mà.',
                image: 'uploads/xiaomi-redmi-note-12-pro-1775436938167.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Dimensity 1080', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 6990000, isSale: true, salePrice: 6290000, stock: 50 }]
            },
            {
                name: 'Xiaomi Redmi 12C', category: xiaomiId,
                description: 'Camera kép 50MP, pin 5000mAh thoải mái dùng 2 ngày.',
                image: 'uploads/xiaomi-redmi-12c-1775436957021.webp',
                specs: { screen: '6.71 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '5MP', cpu: 'Helio G85', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh Dương', colorHex: '#0000ff', storageCapacity: '64GB', network: '4G', price: 2390000, isSale: false, salePrice: 0, stock: 120 }]
            },
            {
                name: 'Xiaomi Poco X5 Pro', category: xiaomiId,
                description: 'Chip rồng mạnh mẽ, thiết kế màu vàng viền đen chuẩn gaming.',
                image: 'uploads/xiaomi-poco-x5-pro-1775437826223.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '16MP', cpu: 'Snapdragon 778G', battery: '5000 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffd700', storageCapacity: '128GB', network: '5G', price: 7290000, isSale: true, salePrice: 6590000, stock: 40 }]
            },
            {
                name: 'Xiaomi 12T', category: xiaomiId,
                description: 'Siêu phẩm cận cao cấp, sạc siêu nhanh 120W.',
                image: 'uploads/xiaomi-12t-1775439334570.jpg',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '20MP', cpu: 'Dimensity 8100 Ultra', battery: '5000 mAh' },
                variants: [{ colorName: 'Bạc', colorHex: '#c0c0c0', storageCapacity: '256GB', network: '5G', price: 11990000, isSale: false, salePrice: 0, stock: 30 }]
            },

            // ======================== VIVO (12 MÁY CỰC KHỦNG - MỚI UPDATE) ========================
            {
                name: 'Vivo X100 Ultra', category: vivoId,
                description: 'Tuyệt tác camera 200MP Zeiss APO, chip Snapdragon 8 Gen 3 siêu khủng.',
                image: 'uploads/vivo_x100_ultra.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 14', cameraBack: '200MP', cameraFront: '50MP', cpu: 'Snapdragon 8 Gen 3', battery: '5500 mAh' },
                variants: [{ colorName: 'Titanium', colorHex: '#878681', storageCapacity: '512GB', network: '5G', price: 34990000, isSale: true, salePrice: 32990000, stock: 10 }]
            },
            {
                name: 'Vivo X100 Pro', category: vivoId,
                description: 'Đỉnh cao nhiếp ảnh di động kết hợp cùng ZEISS, zoom tiềm vọng.',
                image: 'uploads/vivo_x100_pro.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9300', battery: '5400 mAh' },
                variants: [{ colorName: 'Cam', colorHex: '#ff8c00', storageCapacity: '512GB', network: '5G', price: 29990000, isSale: true, salePrice: 28500000, stock: 15 }]
            },
            {
                name: 'Vivo X100', category: vivoId,
                description: 'Hiệu năng bùng nổ Dimensity 9300, sạc siêu tốc 120W.',
                image: 'uploads/vivo_x100.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9300', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh ngọc', colorHex: '#7fffd4', storageCapacity: '256GB', network: '5G', price: 22990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Vivo X Fold3 Pro', category: vivoId,
                description: 'Điện thoại gập siêu mỏng nhẹ, pin trâu nhất thế giới gập.',
                image: 'uploads/vivo_x_fold3_pro.webp',
                specs: { screen: '8.03 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '5700 mAh' },
                variants: [{ colorName: 'Trắng sương', colorHex: '#f0f8ff', storageCapacity: '512GB', network: '5G', price: 39990000, isSale: true, salePrice: 38500000, stock: 8 }]
            },
            {
                name: 'Vivo X Fold3', category: vivoId,
                description: 'Gập mở linh hoạt, bản lề hàng không vũ trụ siêu bền.',
                image: 'uploads/vivo_x_fold3.webp',
                specs: { screen: '8.03 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '5500 mAh' },
                variants: [{ colorName: 'Đen nhám', colorHex: '#222222', storageCapacity: '256GB', network: '5G', price: 31990000, isSale: false, salePrice: 0, stock: 12 }]
            },
            {
                name: 'Vivo X90 Pro+', category: vivoId,
                description: 'Cảm biến 1 inch siêu to khổng lồ, vua camera đêm.',
                image: 'uploads/vivo_x90_pro_plus.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '4700 mAh' },
                variants: [{ colorName: 'Đỏ da', colorHex: '#8b0000', storageCapacity: '256GB', network: '5G', price: 25990000, isSale: true, salePrice: 24500000, stock: 10 }]
            },
            {
                name: 'Vivo X90 Pro', category: vivoId,
                description: 'Cấu hình đẳng cấp, màn hình AMOLED 120Hz rực rỡ.',
                image: 'uploads/vivo_x90_pro.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9200', battery: '4870 mAh' },
                variants: [{ colorName: 'Đen huyền', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 21990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'Vivo X Note', category: vivoId,
                description: 'Màn hình khổng lồ 7 inch cho doanh nhân, bảo mật vân tay siêu âm.',
                image: 'uploads/vivo_x_note.webp',
                specs: { screen: '7.0 inch', os: 'Funtouch OS 12', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Snapdragon 8 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh dương', colorHex: '#00008b', storageCapacity: '256GB', network: '5G', price: 23990000, isSale: true, salePrice: 21500000, stock: 10 }]
            },
            {
                name: 'Vivo X80 Pro', category: vivoId,
                description: 'Định hình lại quay phim điện ảnh trên smartphone với Zeiss.',
                image: 'uploads/vivo_x80_pro.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 12', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 1', battery: '4700 mAh' },
                variants: [{ colorName: 'Cam da', colorHex: '#ff7f50', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'iQOO 12 Pro', category: vivoId,
                description: 'Quái thú gaming từ Vivo, màn 2K 144Hz cực mượt.',
                image: 'uploads/iqoo_12_pro.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Snapdragon 8 Gen 3', battery: '5100 mAh' },
                variants: [{ colorName: 'BMW Legend', colorHex: '#ffffff', storageCapacity: '512GB', network: '5G', price: 23990000, isSale: true, salePrice: 22500000, stock: 15 }]
            },
            {
                name: 'iQOO 12', category: vivoId,
                description: 'Hiệu năng eSports vượt trội, tản nhiệt buồng hơi khổng lồ.',
                image: 'uploads/iqoo_12.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 14', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Snapdragon 8 Gen 3', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen nhám', colorHex: '#222222', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 22 }]
            },
            {
                name: 'iQOO 11S', category: vivoId,
                description: 'Sạc nhanh 200W vô địch, cấu hình tối ưu chơi game.',
                image: 'uploads/iqoo_11s.webp',
                specs: { screen: '6.78 inch', os: 'Funtouch OS 13', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Snapdragon 8 Gen 2', battery: '4700 mAh' },
                variants: [{ colorName: 'Xanh Track', colorHex: '#2e8b57', storageCapacity: '256GB', network: '5G', price: 17990000, isSale: true, salePrice: 16500000, stock: 18 }]
            },

            // ======================== OPPO (12 MÁY CỰC KHỦNG - MỚI UPDATE) ========================
            {
                name: 'Oppo Find X7 Ultra', category: oppoId,
                description: 'Camera kép tele tiềm vọng đầu tiên thế giới, Hasselblad tinh chỉnh.',
                image: 'uploads/oppo_find_x7_ultra.webp',
                specs: { screen: '6.82 inch', os: 'ColorOS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh biển', colorHex: '#000080', storageCapacity: '512GB', network: '5G', price: 31990000, isSale: true, salePrice: 30500000, stock: 12 }]
            },
            {
                name: 'Oppo Find X7', category: oppoId,
                description: 'Thiết kế cao cấp, chip Dimensity 9300 mạnh mẽ.',
                image: 'uploads/oppo_find_x7.webp',
                specs: { screen: '6.78 inch', os: 'ColorOS 14', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9300', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen sao', colorHex: '#111111', storageCapacity: '256GB', network: '5G', price: 23990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'Oppo Find N3', category: oppoId,
                description: 'Kiệt tác màn hình gập mỏng nhẹ nhất của hãng, nếp gấp vô hình.',
                image: 'uploads/oppo_find_n3.webp',
                specs: { screen: '7.82 inch', os: 'ColorOS 13.2', cameraBack: '48MP', cameraFront: '20MP', cpu: 'Snapdragon 8 Gen 2', battery: '4805 mAh' },
                variants: [{ colorName: 'Vàng hồng', colorHex: '#ffb6c1', storageCapacity: '512GB', network: '5G', price: 44990000, isSale: true, salePrice: 42990000, stock: 8 }]
            },
            {
                name: 'Oppo Find N3 Flip', category: oppoId,
                description: 'Cụm 3 camera sau đỉnh cao lần đầu tiên trên điện thoại nắp gập.',
                image: 'uploads/oppo_find_n3_flip.webp',
                specs: { screen: '6.8 inch', os: 'ColorOS 13.2', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9200', battery: '4300 mAh' },
                variants: [{ colorName: 'Đen bóng', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 22990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'Oppo Find X6 Pro', category: oppoId,
                description: 'Mặt lưng da cực sang trọng, camera lấy nét cực nhanh với chip Marisilicon.',
                image: 'uploads/oppo_find_x6_pro.webp',
                specs: { screen: '6.82 inch', os: 'ColorOS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '5000 mAh' },
                variants: [{ colorName: 'Nâu da', colorHex: '#a52a2a', storageCapacity: '256GB', network: '5G', price: 26990000, isSale: true, salePrice: 25500000, stock: 10 }]
            },
            {
                name: 'Oppo Find X6', category: oppoId,
                description: 'Màn hình hiển thị chân thực 1 tỷ màu, tối ưu cho nhiếp ảnh nghệ thuật.',
                image: 'uploads/oppo_find_x6.webp',
                specs: { screen: '6.74 inch', os: 'ColorOS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9200', battery: '4800 mAh' },
                variants: [{ colorName: 'Xanh rêu', colorHex: '#00ff7f', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Oppo Find X5 Pro', category: oppoId,
                description: 'Thiết kế mặt lưng gốm nguyên khối liền mạch, cực kỳ độc đáo và bền bỉ.',
                image: 'uploads/oppo_find_x5_pro.webp',
                specs: { screen: '6.7 inch', os: 'ColorOS 12.1', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Trắng gốm', colorHex: '#f8f8ff', storageCapacity: '256GB', network: '5G', price: 17990000, isSale: true, salePrice: 15500000, stock: 10 }]
            },
            {
                name: 'Oppo Find N2', category: oppoId,
                description: 'Gập mở tiện lợi, thiết kế gọn gàng bỏ túi hoàn hảo.',
                image: 'uploads/oppo_find_n2.webp',
                specs: { screen: '7.1 inch', os: 'ColorOS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8+ Gen 1', battery: '4520 mAh' },
                variants: [{ colorName: 'Xanh lá', colorHex: '#008000', storageCapacity: '256GB', network: '5G', price: 32990000, isSale: false, salePrice: 0, stock: 5 }]
            },
            {
                name: 'Oppo Find N2 Flip', category: oppoId,
                description: 'Màn hình ngoài dọc lớn nhất, thao tác nhanh không cần mở máy.',
                image: 'uploads/oppo_find_n2_flip.webp',
                specs: { screen: '6.8 inch', os: 'ColorOS 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Dimensity 9000+', battery: '4300 mAh' },
                variants: [{ colorName: 'Tím nhạt', colorHex: '#e6e6fa', storageCapacity: '256GB', network: '5G', price: 16990000, isSale: true, salePrice: 14500000, stock: 25 }]
            },
            {
                name: 'Oppo Ace 3 Pro', category: oppoId,
                description: 'Siêu phẩm gaming, tản nhiệt hàng không vũ trụ mới.',
                image: 'uploads/oppo_ace_3_pro.webp',
                specs: { screen: '6.78 inch', os: 'ColorOS 14', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Snapdragon 8 Gen 3', battery: '6100 mAh' },
                variants: [{ colorName: 'Bạc gốm', colorHex: '#c0c0c0', storageCapacity: '512GB', network: '5G', price: 18990000, isSale: false, salePrice: 0, stock: 30 }]
            },
            {
                name: 'Oppo Find X3 Pro', category: oppoId,
                description: 'Màn hình 1 tỷ màu siêu thực, camera kính hiển vi độc lạ.',
                image: 'uploads/oppo_find_x3_pro.webp',
                specs: { screen: '6.7 inch', os: 'ColorOS 11.2', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 888', battery: '4500 mAh' },
                variants: [{ colorName: 'Xanh lam', colorHex: '#0000ff', storageCapacity: '256GB', network: '5G', price: 14990000, isSale: true, salePrice: 13500000, stock: 15 }]
            },
            {
                name: 'Oppo Find X5', category: oppoId,
                description: 'Hiệu năng mạnh mẽ với chip Snapdragon 888, sạc 80W.',
                image: 'uploads/oppo_find_x5.webp',
                specs: { screen: '6.55 inch', os: 'ColorOS 12.1', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 888', battery: '4800 mAh' },
                variants: [{ colorName: 'Đen mờ', colorHex: '#333333', storageCapacity: '256GB', network: '5G', price: 12990000, isSale: false, salePrice: 0, stock: 20 }]
            }
        ];

        await Product.insertMany(productsData);
        console.log(`Thành công rực rỡ! Đã bơm ${productsData.length} siêu phẩm vào cơ sở dữ liệu.`);

        process.exit();
    } catch (error) {
        console.error('Lỗi Seeder:', error);
        process.exit(1);
    }
};

seedData();