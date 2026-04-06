const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
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
        console.log('Đã tạo Admin (admin@nnit.com) và User (usertest1@nnit.com) | Pass: 12345');

        const createdCategories = await Category.insertMany([
            { name: 'iPhone' },
            { name: 'Samsung' },
            { name: 'Xiaomi' }
        ]);
        
        const iphoneId = createdCategories[0]._id;
        const samsungId = createdCategories[1]._id;
        const xiaomiId = createdCategories[2]._id;

        const productsData = [
            // ======================== IPHONE (12 SẢN PHẨM) ========================
            {
                name: 'iPhone 13 mini', category: iphoneId,
                description: 'Kích thước nhỏ gọn, hiệu năng cực lớn với chip A15.',
                image: 'uploads/iPhone_13_mini.webp',
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
                image: 'uploads/iPhone_15_Plus.webp',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '4383 mAh' },
                variants: [{ colorName: 'Xanh dương', colorHex: '#d2e3f0', storageCapacity: '128GB', network: '5G', price: 23990000, isSale: true, salePrice: 22500000, stock: 30 }]
            },
            {
                name: 'iPhone 15 Pro Max', category: iphoneId,
                description: 'Khung Titan bền bỉ, chip A17 Pro chơi game đỉnh cao.',
                image: 'uploads/iPhone_15_Pro_Max.webp',
                specs: { screen: '6.7 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A17 Pro', battery: '4422 mAh' },
                variants: [{ colorName: 'Titan Tự Nhiên', colorHex: '#cfc8bc', storageCapacity: '256GB', network: '5G', price: 30990000, isSale: true, salePrice: 29500000, stock: 25 }]
            },
            {
                name: 'iPhone 11', category: iphoneId,
                description: 'Sự lựa chọn quốc dân với giá thành cực kỳ dễ tiếp cận.',
                image: 'uploads/iPhone_11.webp',
                specs: { screen: '6.1 inch', os: 'iOS 13', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A13', battery: '3110 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '64GB', network: '4G', price: 9990000, isSale: true, salePrice: 8500000, stock: 40 }]
            },
            {
                name: 'iPhone 12', category: iphoneId,
                description: 'Thiết kế vuông vức thời thượng, màn hình OLED sắc nét.',
                image: 'uploads/iPhone_12.webp',
                specs: { screen: '6.1 inch', os: 'iOS 14', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A14', battery: '2815 mAh' },
                variants: [{ colorName: 'Xanh Mint', colorHex: '#98ff98', storageCapacity: '128GB', network: '5G', price: 12990000, isSale: false, salePrice: 0, stock: 35 }]
            },
            {
                name: 'iPhone 13', category: iphoneId,
                description: 'Cụm camera chéo đặc trưng, pin trâu hơn thế hệ trước.',
                image: 'uploads/iPhone_13.webp',
                specs: { screen: '6.1 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3240 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '128GB', network: '5G', price: 14990000, isSale: true, salePrice: 13990000, stock: 50 }]
            },
            {
                name: 'iPhone 13 Pro', category: iphoneId,
                description: 'Màn hình ProMotion 120Hz mượt mà, camera Macro siêu đỉnh.',
                image: 'uploads/iPhone_13_Pro.webp',
                specs: { screen: '6.1 inch', os: 'iOS 15', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3095 mAh' },
                variants: [{ colorName: 'Xanh Sierra', colorHex: '#a0b1c0', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                name: 'iPhone 14', category: iphoneId,
                description: 'Nâng cấp RAM và camera trước, hỗ trợ liên lạc vệ tinh.',
                image: 'uploads/iPhone_14.webp',
                specs: { screen: '6.1 inch', os: 'iOS 16', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '3279 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffeb3b', storageCapacity: '128GB', network: '5G', price: 18490000, isSale: true, salePrice: 17500000, stock: 22 }]
            },
            {
                name: 'iPhone 14 Plus', category: iphoneId,
                description: 'Màn hình khổng lồ 6.7 inch với thời lượng pin kỷ lục.',
                image: 'uploads/iPhone_14_Plus.webp',
                specs: { screen: '6.7 inch', os: 'iOS 16', cameraBack: '12MP', cameraFront: '12MP', cpu: 'Apple A15', battery: '4325 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#e6e6fa', storageCapacity: '256GB', network: '5G', price: 21990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'iPhone 15', category: iphoneId,
                description: 'Thiết kế mặt lưng nhám, Dynamic Island và camera 48MP.',
                image: 'uploads/iPhone_15.webp',
                specs: { screen: '6.1 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A16', battery: '3349 mAh' },
                variants: [{ colorName: 'Hồng', colorHex: '#ffb6c1', storageCapacity: '128GB', network: '5G', price: 20990000, isSale: true, salePrice: 19500000, stock: 45 }]
            },
            {
                name: 'iPhone 15 Pro', category: iphoneId,
                description: 'Sức mạnh Pro trong thiết kế nhỏ gọn, viền Titan siêu nhẹ.',
                image: 'uploads/iPhone_15_Pro.webp',
                specs: { screen: '6.1 inch', os: 'iOS 17', cameraBack: '48MP', cameraFront: '12MP', cpu: 'Apple A17 Pro', battery: '3274 mAh' },
                variants: [{ colorName: 'Titan Xanh', colorHex: '#4b5363', storageCapacity: '256GB', network: '5G', price: 27990000, isSale: false, salePrice: 0, stock: 20 }]
            },

            // ======================== SAMSUNG (12 SẢN PHẨM) ========================
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
                image: 'uploads/Samsung_Galaxy_Z_Flip5.webp',
                specs: { screen: '6.7 inch', os: 'Android 13', cameraBack: '12MP', cameraFront: '10MP', cpu: 'Snapdragon 8 Gen 2', battery: '3700 mAh' },
                variants: [{ colorName: 'Xanh Mint', colorHex: '#98ff98', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: false, salePrice: 0, stock: 10 }]
            },
            {
                name: 'Samsung Galaxy S23', category: samsungId,
                description: 'Thiết kế tinh giản, sức mạnh Snapdragon 8 Gen 2.',
                image: 'uploads/Samsung_Galaxy_S23.webp',
                specs: { screen: '6.1 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 2', battery: '3900 mAh' },
                variants: [{ colorName: 'Kem', colorHex: '#f5f5dc', storageCapacity: '128GB', network: '5G', price: 16990000, isSale: true, salePrice: 15500000, stock: 25 }]
            },
            {
                name: 'Samsung Galaxy S23 Plus', category: samsungId,
                description: 'Màn hình lớn hơn, giải trí và làm việc đã hơn.',
                image: 'uploads/Samsung_Galaxy_S23_Plus.webp',
                specs: { screen: '6.6 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Snapdragon 8 Gen 2', battery: '4700 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 20990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                name: 'Samsung Galaxy S24', category: samsungId,
                description: 'Định nghĩa lại điện thoại với trí tuệ nhân tạo Galaxy AI.',
                image: 'uploads/Samsung_Galaxy_S24.webp',
                specs: { screen: '6.2 inch', os: 'Android 14', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Exynos 2400', battery: '4000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#800080', storageCapacity: '256GB', network: '5G', price: 22990000, isSale: true, salePrice: 21500000, stock: 35 }]
            },
            {
                name: 'Samsung Galaxy S24 Plus', category: samsungId,
                description: 'Màn hình Quad HD+ cực sắc nét, AI thông minh mọi lúc.',
                image: 'uploads/Samsung_Galaxy_S24_Plus.webp',
                specs: { screen: '6.7 inch', os: 'Android 14', cameraBack: '50MP', cameraFront: '12MP', cpu: 'Exynos 2400', battery: '4900 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffd700', storageCapacity: '256GB', network: '5G', price: 25990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Samsung Galaxy Z Fold5', category: samsungId,
                description: 'Siêu phẩm màn hình gập, bản lề Flex khít hoàn toàn.',
                image: 'uploads/Samsung_Galaxy_Z_Fold5.webp',
                specs: { screen: '7.6 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '10MP', cpu: 'Snapdragon 8 Gen 2', battery: '4400 mAh' },
                variants: [{ colorName: 'Xanh Icy', colorHex: '#aed9e0', storageCapacity: '512GB', network: '5G', price: 35990000, isSale: true, salePrice: 33500000, stock: 12 }]
            },
            {
                name: 'Samsung Galaxy A54', category: samsungId,
                description: 'Thiết kế lấy cảm hứng từ dòng S, mặt lưng kính sang trọng.',
                image: 'uploads/Samsung_Galaxy_A54.webp',
                specs: { screen: '6.4 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Exynos 1380', battery: '5000 mAh' },
                variants: [{ colorName: 'Tím', colorHex: '#d8bfd8', storageCapacity: '128GB', network: '5G', price: 8490000, isSale: false, salePrice: 0, stock: 60 }]
            },
            {
                name: 'Samsung Galaxy A34', category: samsungId,
                description: 'Cấu hình mạnh mẽ, chống nước bụi IP67.',
                image: 'uploads/Samsung_Galaxy_A34.webp',
                specs: { screen: '6.6 inch', os: 'Android 13', cameraBack: '48MP', cameraFront: '13MP', cpu: 'Dimensity 1080', battery: '5000 mAh' },
                variants: [{ colorName: 'Bạc', colorHex: '#c0c0c0', storageCapacity: '128GB', network: '5G', price: 6590000, isSale: true, salePrice: 5990000, stock: 55 }]
            },
            {
                name: 'Samsung Galaxy S22 Ultra', category: samsungId,
                description: 'Mẫu flagship thiết kế vuông vắn, bút S Pen tích hợp.',
                image: 'uploads/Samsung_Galaxy_S22_Ultra.webp',
                specs: { screen: '6.8 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '40MP', cpu: 'Snapdragon 8 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Đỏ', colorHex: '#8b0000', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: false, salePrice: 0, stock: 15 }]
            },

            // ======================== XIAOMI (12 SẢN PHẨM) ========================
            {
                name: 'Xiaomi 14 Pro', category: xiaomiId,
                description: 'Camera Leica đỉnh cao, HyperOS mượt mà.',
                image: 'uploads/Xiaomi_14_Pro.webp',
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
                image: 'uploads/Xiaomi_Redmi_13C.webp',
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
                image: 'uploads/Xiaomi_14.webp',
                specs: { screen: '6.36 inch', os: 'HyperOS', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 3', battery: '4610 mAh' },
                variants: [{ colorName: 'Trắng', colorHex: '#ffffff', storageCapacity: '256GB', network: '5G', price: 18990000, isSale: true, salePrice: 17500000, stock: 25 }]
            },
            {
                name: 'Xiaomi 13', category: xiaomiId,
                description: 'Camera tinh chỉnh bởi Leica, thiết kế viền vuông.',
                image: 'uploads/Xiaomi_13.webp',
                specs: { screen: '6.36 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '4500 mAh' },
                variants: [{ colorName: 'Xanh Flora', colorHex: '#a0db8e', storageCapacity: '256GB', network: '5G', price: 15990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                name: 'Xiaomi 13 Pro', category: xiaomiId,
                description: 'Màn hình cong tràn viền, cảm biến camera 1 inch.',
                image: 'uploads/Xiaomi_13_Pro.webp',
                specs: { screen: '6.73 inch', os: 'Android 13', cameraBack: '50MP', cameraFront: '32MP', cpu: 'Snapdragon 8 Gen 2', battery: '4820 mAh' },
                variants: [{ colorName: 'Đen Gốm', colorHex: '#1a1a1a', storageCapacity: '256GB', network: '5G', price: 19990000, isSale: true, salePrice: 18500000, stock: 15 }]
            },
            {
                name: 'Xiaomi Redmi Note 12', category: xiaomiId,
                description: 'Màn hình AMOLED 120Hz mượt mà nhất phân khúc.',
                image: 'uploads/Xiaomi_Redmi_Note_12.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '13MP', cpu: 'Snapdragon 4 Gen 1', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh Băng', colorHex: '#b2ffff', storageCapacity: '128GB', network: '4G', price: 4490000, isSale: false, salePrice: 0, stock: 80 }]
            },
            {
                name: 'Xiaomi Redmi Note 12 Pro', category: xiaomiId,
                description: 'Sạc nhanh 67W, chip Dimensity xử lý mượt mà.',
                image: 'uploads/Xiaomi_Redmi_Note_12_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '16MP', cpu: 'Dimensity 1080', battery: '5000 mAh' },
                variants: [{ colorName: 'Đen', colorHex: '#000000', storageCapacity: '256GB', network: '5G', price: 6990000, isSale: true, salePrice: 6290000, stock: 50 }]
            },
            {
                name: 'Xiaomi Redmi 12C', category: xiaomiId,
                description: 'Camera kép 50MP, pin 5000mAh thoải mái dùng 2 ngày.',
                image: 'uploads/Xiaomi_Redmi_12C.webp',
                specs: { screen: '6.71 inch', os: 'Android 12', cameraBack: '50MP', cameraFront: '5MP', cpu: 'Helio G85', battery: '5000 mAh' },
                variants: [{ colorName: 'Xanh Dương', colorHex: '#0000ff', storageCapacity: '64GB', network: '4G', price: 2390000, isSale: false, salePrice: 0, stock: 120 }]
            },
            {
                name: 'Xiaomi Poco X5 Pro', category: xiaomiId,
                description: 'Chip rồng mạnh mẽ, thiết kế màu vàng viền đen chuẩn gaming.',
                image: 'uploads/Xiaomi_Poco_X5_Pro.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '16MP', cpu: 'Snapdragon 778G', battery: '5000 mAh' },
                variants: [{ colorName: 'Vàng', colorHex: '#ffd700', storageCapacity: '128GB', network: '5G', price: 7290000, isSale: true, salePrice: 6590000, stock: 40 }]
            },
            {
                name: 'Xiaomi 12T', category: xiaomiId,
                description: 'Siêu phẩm cận cao cấp, sạc siêu nhanh 120W.',
                image: 'uploads/Xiaomi_12T.webp',
                specs: { screen: '6.67 inch', os: 'Android 12', cameraBack: '108MP', cameraFront: '20MP', cpu: 'Dimensity 8100 Ultra', battery: '5000 mAh' },
                variants: [{ colorName: 'Bạc', colorHex: '#c0c0c0', storageCapacity: '256GB', network: '5G', price: 11990000, isSale: false, salePrice: 0, stock: 30 }]
            }
        ];

        await Product.insertMany(productsData);
        console.log(`Thành công! Đã bơm ${productsData.length} sản phẩm tương ứng với ảnh của Nhớ.`);

        process.exit();
    } catch (error) {
        console.error('Lỗi Seeder:', error);
        process.exit(1);
    }
};

seedData();