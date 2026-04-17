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
        firstName: 'Nhớ', lastName: 'Đặng Ngọc', phone: '0123456789', 
        email: 'admin@nnit.com', password: hashedPassword, 
        isAdmin: true, 
        isSuperAdmin: true
    },
    { firstName: 'Thành', lastName: 'Long', phone: '0987654321', email: 'khach1@nnit.com', password: hashedPassword, isAdmin: false },
    { firstName: 'Thanh', lastName: 'Trúc', phone: '0987654322', email: 'khach2@nnit.com', password: hashedPassword, isAdmin: false },
    { firstName: 'Hoàng', lastName: 'Nam', phone: '0987654323', email: 'khach3@nnit.com', password: hashedPassword, isAdmin: false },
    { firstName: 'Minh', lastName: 'Anh', phone: '0987654324', email: 'khach4@nnit.com', password: hashedPassword, isAdmin: false },
    { firstName: 'Bảo', lastName: 'Ngọc', phone: '0987654325', email: 'khach5@nnit.com', password: hashedPassword, isAdmin: false }
]);

        const iphoneId = "69d93d088aca0f96fd9f47aa";
        const samsungId = "69d93d088aca0f96fd9f47ab";
        const xiaomiId = "69d93d088aca0f96fd9f47ac";
        const vivoId = "69d93d088aca0f96fd9f47ad";
        const oppoId = "69d93d088aca0f96fd9f47ae";

        await Category.insertMany([
            { _id: iphoneId, name: 'iPhone' },
            { _id: samsungId, name: 'Samsung' },
            { _id: xiaomiId, name: 'Xiaomi' },
            { _id: vivoId, name: 'Vivo' },
            { _id: oppoId, name: 'Oppo' }
        ]);

        const productsData = [
            // IPHONE
            { _id: "69d93d088aca0f96fd9f47b0", name: "iPhone 13 mini", category: iphoneId, description: "Kích thước nhỏ gọn, hiệu năng cực lớn với chip A15.", image: "uploads/iphone_13_mini-1775439913108.png", rating: 0, numReviews: 0, sold: 0, specs: { screen: "5.4 inch", os: "iOS 15", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A15", battery: "2438 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47b1", colorName: "Hồng", colorHex: "#fad2da", storageCapacity: "128GB", network: "5G", price: 14990000, isSale: true, salePrice: 13500000, stock: 20 }] },
            { _id: "69d93d088aca0f96fd9f47b2", name: "iPhone 14 Pro", category: iphoneId, description: "Dynamic Island đột phá, camera 48MP siêu sắc nét.", image: "uploads/iPhone_14_Pro.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 16", cameraBack: "48MP", cameraFront: "12MP", cpu: "Apple A16", battery: "3200 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47b3", colorName: "Tím", colorHex: "#5c4d5c", storageCapacity: "256GB", network: "5G", price: 24990000, isSale: false, salePrice: 0, stock: 15 }] },
            { _id: "69d93d088aca0f96fd9f47b4", name: "iPhone 15 Plus", category: iphoneId, description: "Màn hình lớn, Dynamic Island và cổng sạc USB-C mới.", image: "uploads/iphone-15-plus-1775439515113.png", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "iOS 17", cameraBack: "48MP", cameraFront: "12MP", cpu: "Apple A16", battery: "4383 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47b5", colorName: "Xanh dương", colorHex: "#d2e3f0", storageCapacity: "128GB", network: "5G", price: 23990000, isSale: true, salePrice: 22500000, stock: 30 }] },
            { _id: "69d93d088aca0f96fd9f47b6", name: "iPhone 15 Pro Max", category: iphoneId, description: "Khung Titan bền bỉ, chip A17 Pro chơi game đỉnh cao.", image: "uploads/iphone-15-pro-max-1775440055796.png", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "iOS 17", cameraBack: "48MP", cameraFront: "12MP", cpu: "Apple A17 Pro", battery: "4422 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47b7", colorName: "Titan Tự Nhiên", colorHex: "#cfc8bc", storageCapacity: "256GB", network: "5G", price: 30990000, isSale: true, salePrice: 29500000, stock: 25 }] },
            { _id: "69d93d088aca0f96fd9f47b8", name: "iPhone 11", category: iphoneId, description: "Sự lựa chọn quốc dân với giá thành cực kỳ dễ tiếp cận.", image: "uploads/iphone-11-1775846555116.png", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 13", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A13", battery: "3110 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47b9", colorName: "Đen", colorHex: "#000000", storageCapacity: "64GB", network: "4G", price: 9990000, isSale: true, salePrice: 8500000, stock: 40 }] },
            { _id: "69d93d088aca0f96fd9f47ba", name: "iPhone 12", category: iphoneId, description: "Thiết kế vuông vức thời thượng, màn hình OLED sắc nét.", image: "uploads/iphone-12-1775437846524.jpg", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 14", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A14", battery: "2815 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47bb", colorName: "Xanh Mint", colorHex: "#98ff98", storageCapacity: "128GB", network: "5G", price: 12990000, isSale: false, salePrice: 0, stock: 35 }] },
            { _id: "69d93d088aca0f96fd9f47bc", name: "iPhone 13", category: iphoneId, description: "Cụm camera chéo đặc trưng, pin trâu hơn thế hệ trước.", image: "uploads/iphone-13-1775846840724.png", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 15", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A15", battery: "3240 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47bd", colorName: "Trắng", colorHex: "#ffffff", storageCapacity: "128GB", network: "5G", price: 14990000, isSale: true, salePrice: 13990000, stock: 50 }] },
            { _id: "69d93d088aca0f96fd9f47be", name: "iPhone 13 Pro", category: iphoneId, description: "Màn hình ProMotion 120Hz mượt mà, camera Macro siêu đỉnh.", image: "uploads/iphone-13-pro-1775439153286.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 15", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A15", battery: "3095 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47bf", colorName: "Xanh Sierra", colorHex: "#a0b1c0", storageCapacity: "256GB", network: "5G", price: 18990000, isSale: false, salePrice: 0, stock: 15 }] },
            { _id: "69d93d088aca0f96fd9f47c0", name: "iPhone 14", category: iphoneId, description: "Nâng cấp RAM và camera trước, hỗ trợ liên lạc vệ tinh.", image: "uploads/iphone-14-1775846961139.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 16", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A15", battery: "3279 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47c1", colorName: "Vàng", colorHex: "#ffeb3b", storageCapacity: "128GB", network: "5G", price: 18490000, isSale: true, salePrice: 17500000, stock: 22 }] },
            { _id: "69d93d088aca0f96fd9f47c2", name: "iPhone 14 Plus", category: iphoneId, description: "Màn hình khổng lồ 6.7 inch với thời lượng pin kỷ lục.", image: "uploads/iphone-14-plus-1775439202589.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "iOS 16", cameraBack: "12MP", cameraFront: "12MP", cpu: "Apple A15", battery: "4325 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47c3", colorName: "Tím", colorHex: "#e6e6fa", storageCapacity: "256GB", network: "5G", price: 21990000, isSale: false, salePrice: 0, stock: 18 }] },
            { _id: "69d93d088aca0f96fd9f47c4", name: "iPhone 15", category: iphoneId, description: "Thiết kế mặt lưng nhám, Dynamic Island và camera 48MP.", image: "uploads/iphone-15-1775439219453.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 17", cameraBack: "48MP", cameraFront: "12MP", cpu: "Apple A16", battery: "3349 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47c5", colorName: "Hồng", colorHex: "#ffb6c1", storageCapacity: "128GB", network: "5G", price: 20990000, isSale: true, salePrice: 19500000, stock: 45 }] },
            { _id: "69d93d088aca0f96fd9f47c6", name: "iPhone 15 Pro", category: iphoneId, description: "Sức mạnh Pro trong thiết kế nhỏ gọn, viền Titan siêu nhẹ.", image: "uploads/iphone-15-pro-1775440147044.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "iOS 17", cameraBack: "48MP", cameraFront: "12MP", cpu: "Apple A17 Pro", battery: "3274 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47c7", colorName: "Titan Xanh", colorHex: "#4b5363", storageCapacity: "256GB", network: "5G", price: 27990000, isSale: false, salePrice: 0, stock: 20 }] },
            
            // SAMSUNG
            { _id: "69d93d088aca0f96fd9f47c8", name: "Samsung Galaxy M54", category: samsungId, description: "Pin khủng 6000mAh, màn hình Super AMOLED 120Hz.", image: "uploads/Samsung_Galaxy_M54.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "Android 13", cameraBack: "108MP", cameraFront: "32MP", cpu: "Exynos 1380", battery: "6000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47c9", colorName: "Xanh", colorHex: "#2e4a7d", storageCapacity: "128GB", network: "5G", price: 8990000, isSale: false, salePrice: 0, stock: 50 }] },
            { _id: "69d93d088aca0f96fd9f47ca", name: "Samsung Galaxy S23 FE", category: samsungId, description: "Trải nghiệm flagship giá hợp lý, camera 50MP.", image: "uploads/Samsung_Galaxy_S23_FE.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.4 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "10MP", cpu: "Exynos 2200", battery: "4500 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47cb", colorName: "Mint", colorHex: "#b2f2bb", storageCapacity: "128GB", network: "5G", price: 12990000, isSale: true, salePrice: 11500000, stock: 40 }] },
            { _id: "69d93d088aca0f96fd9f47cc", name: "Samsung Galaxy S24 Ultra", category: samsungId, description: "Quyền năng Galaxy AI, bút S Pen và zoom 100x.", image: "uploads/Samsung_Galaxy_S24_Ultra.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.8 inch", os: "Android 14", cameraBack: "200MP", cameraFront: "12MP", cpu: "Snapdragon 8 Gen 3", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47cd", colorName: "Xám Titan", colorHex: "#8e8e8e", storageCapacity: "256GB", network: "5G", price: 29990000, isSale: true, salePrice: 28500000, stock: 15 }] },
            { _id: "69d93d088aca0f96fd9f47ce", name: "Samsung Galaxy Z Flip5", category: samsungId, description: "Màn hình ngoài Flex Window cực lớn, gập mở cá tính.", image: "uploads/samsung-galaxy-z-flip5-1775439256618.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "Android 13", cameraBack: "12MP", cameraFront: "10MP", cpu: "Snapdragon 8 Gen 2", battery: "3700 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47cf", colorName: "Xanh Mint", colorHex: "#98ff98", storageCapacity: "256GB", network: "5G", price: 19990000, isSale: false, salePrice: 0, stock: 10 }] },
            { _id: "69d93d088aca0f96fd9f47d0", name: "Samsung Galaxy S23", category: samsungId, description: "Thiết kế tinh giản, sức mạnh Snapdragon 8 Gen 2.", image: "uploads/samsung-galaxy-s23-1775439283329.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.1 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "12MP", cpu: "Snapdragon 8 Gen 2", battery: "3900 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47d1", colorName: "Kem", colorHex: "#f5f5dc", storageCapacity: "128GB", network: "5G", price: 16990000, isSale: true, salePrice: 15500000, stock: 25 }] },
            { _id: "69d93d088aca0f96fd9f47d2", name: "Samsung Galaxy S23 Plus", category: samsungId, description: "Màn hình lớn hơn, giải trí và làm việc đã hơn.", image: "uploads/samsung-galaxy-s23-plus-1775439318101.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.6 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "12MP", cpu: "Snapdragon 8 Gen 2", battery: "4700 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47d3", colorName: "Đen", colorHex: "#000000", storageCapacity: "256GB", network: "5G", price: 20990000, isSale: false, salePrice: 0, stock: 18 }] },
            { _id: "69d93d088aca0f96fd9f47d4", name: "Samsung Galaxy S24", category: samsungId, description: "Định nghĩa lại điện thoại với trí tuệ nhân tạo Galaxy AI.", image: "uploads/samsung-galaxy-s24-1775436892555.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.2 inch", os: "Android 14", cameraBack: "50MP", cameraFront: "12MP", cpu: "Exynos 2400", battery: "4000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47d5", colorName: "Tím", colorHex: "#800080", storageCapacity: "256GB", network: "5G", price: 22990000, isSale: true, salePrice: 21500000, stock: 35 }] },
            { _id: "69d93d088aca0f96fd9f47d6", name: "Samsung Galaxy S24 Plus", category: samsungId, description: "Màn hình Quad HD+ cực sắc nét, AI thông minh mọi lúc.", image: "uploads/samsung-galaxy-s24-plus-1775439396309.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.7 inch", os: "Android 14", cameraBack: "50MP", cameraFront: "12MP", cpu: "Exynos 2400", battery: "4900 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47d7", colorName: "Vàng", colorHex: "#ffd700", storageCapacity: "256GB", network: "5G", price: 25990000, isSale: false, salePrice: 0, stock: 20 }] },
            { _id: "69d93d088aca0f96fd9f47d8", name: "Samsung Galaxy Z Fold5", category: samsungId, description: "Siêu phẩm màn hình gập, bản lề Flex khít hoàn toàn.", image: "uploads/samsung-galaxy-z-fold5-1775439411028.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "7.6 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "10MP", cpu: "Snapdragon 8 Gen 2", battery: "4400 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47d9", colorName: "Xanh Icy", colorHex: "#aed9e0", storageCapacity: "512GB", network: "5G", price: 35990000, isSale: true, salePrice: 33500000, stock: 12 }] },
            { _id: "69d93d088aca0f96fd9f47da", name: "Samsung Galaxy A54", category: samsungId, description: "Thiết kế lấy cảm hứng từ dòng S, mặt lưng kính sang trọng.", image: "uploads/samsung-galaxy-a54-1775439423544.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.4 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Exynos 1380", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47db", colorName: "Tím", colorHex: "#d8bfd8", storageCapacity: "128GB", network: "5G", price: 8490000, isSale: false, salePrice: 0, stock: 60 }] },
            { _id: "69d93d088aca0f96fd9f47dc", name: "Samsung Galaxy A34", category: samsungId, description: "Cấu hình mạnh mẽ, chống nước bụi IP67.", image: "uploads/samsung-galaxy-a34-1775439437360.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.6 inch", os: "Android 13", cameraBack: "48MP", cameraFront: "13MP", cpu: "Dimensity 1080", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47dd", colorName: "Bạc", colorHex: "#c0c0c0", storageCapacity: "128GB", network: "5G", price: 6590000, isSale: true, salePrice: 5990000, stock: 55 }] },
            { _id: "69d93d088aca0f96fd9f47de", name: "Samsung Galaxy S22 Ultra", category: samsungId, description: "Mẫu flagship thiết kế vuông vắn, bút S Pen tích hợp.", image: "uploads/samsung-galaxy-s22-ultra-1775439448497.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.8 inch", os: "Android 12", cameraBack: "108MP", cameraFront: "40MP", cpu: "Snapdragon 8 Gen 1", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47df", colorName: "Đỏ", colorHex: "#8b0000", storageCapacity: "256GB", network: "5G", price: 18990000, isSale: false, salePrice: 0, stock: 15 }] },

            // XIAOMI
            { _id: "69d93d088aca0f96fd9f47e0", name: "Xiaomi 14 Pro", category: xiaomiId, description: "Camera Leica đỉnh cao, HyperOS mượt mà.", image: "uploads/xiaomi_14_pro-1775440192803.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.73 inch", os: "HyperOS", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 3", battery: "4880 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47e1", colorName: "Đen", colorHex: "#000000", storageCapacity: "512GB", network: "5G", price: 21990000, isSale: true, salePrice: 20500000, stock: 12 }] },
            { _id: "69d93d088aca0f96fd9f47e2", name: "Xiaomi Poco F5 Pro", category: xiaomiId, description: "Siêu phẩm gaming, màn hình 2K cực nét.", image: "uploads/Xiaomi_Poco_F5_Pro.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 13", cameraBack: "64MP", cameraFront: "16MP", cpu: "Snapdragon 8+ Gen 1", battery: "5160 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47e3", colorName: "Trắng", colorHex: "#ffffff", storageCapacity: "256GB", network: "5G", price: 11990000, isSale: false, salePrice: 0, stock: 35 }] },
            { _id: "69d93d088aca0f96fd9f47e4", name: "Xiaomi Redmi 13C", category: xiaomiId, description: "Giá cực rẻ, pin trâu, thiết kế trẻ trung.", image: "uploads/xiaomi-redmi-13c-1775439460841.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.74 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "8MP", cpu: "Helio G85", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47e5", colorName: "Đen", colorHex: "#000000", storageCapacity: "128GB", network: "4G", price: 3090000, isSale: true, salePrice: 2890000, stock: 100 }] },
            { _id: "69d93d088aca0f96fd9f47e6", name: "Xiaomi Redmi Note 13 Pro", category: xiaomiId, description: "Camera 200MP siêu nét, sạc nhanh thần tốc.", image: "uploads/Xiaomi_Redmi_Note_13_Pro.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 13", cameraBack: "200MP", cameraFront: "16MP", cpu: "Helio G99 Ultra", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47e7", colorName: "Tím", colorHex: "#d8bfd8", storageCapacity: "256GB", network: "4G", price: 7990000, isSale: false, salePrice: 0, stock: 45 }] },
            { _id: "69d93d088aca0f96fd9f47e8", name: "Xiaomi 14", category: xiaomiId, description: "Flagship nhỏ gọn, viền siêu mỏng, hiệu năng dẫn đầu.", image: "uploads/xiaomi-14-1775439474184.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.36 inch", os: "HyperOS", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 3", battery: "4610 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47e9", colorName: "Trắng", colorHex: "#ffffff", storageCapacity: "256GB", network: "5G", price: 18990000, isSale: true, salePrice: 17500000, stock: 25 }] },
            { _id: "69d93d088aca0f96fd9f47ea", name: "Xiaomi 13", category: xiaomiId, description: "Camera tinh chỉnh bởi Leica, thiết kế viền vuông.", image: "uploads/xiaomi-13-1775439488773.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.36 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 2", battery: "4500 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47eb", colorName: "Xanh Flora", colorHex: "#a0db8e", storageCapacity: "256GB", network: "5G", price: 15990000, isSale: false, salePrice: 0, stock: 20 }] },
            { _id: "69d93d088aca0f96fd9f47ec", name: "Xiaomi 13 Pro", category: xiaomiId, description: "Màn hình cong tràn viền, cảm biến camera 1 inch.", image: "uploads/xiaomi-13-pro-1775439501904.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.73 inch", os: "Android 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 2", battery: "4820 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47ed", colorName: "Đen Gốm", colorHex: "#1a1a1a", storageCapacity: "256GB", network: "5G", price: 19990000, isSale: true, salePrice: 18500000, stock: 15 }] },
            { _id: "69d93d088aca0f96fd9f47ee", name: "Xiaomi Redmi Note 12", category: xiaomiId, description: "Màn hình AMOLED 120Hz mượt mà nhất phân khúc.", image: "uploads/xiaomi-redmi-note-12-1775436919352.jpg", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 12", cameraBack: "50MP", cameraFront: "13MP", cpu: "Snapdragon 4 Gen 1", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47ef", colorName: "Xanh Băng", colorHex: "#b2ffff", storageCapacity: "128GB", network: "4G", price: 4490000, isSale: false, salePrice: 0, stock: 80 }] },
            { _id: "69d93d088aca0f96fd9f47f0", name: "Xiaomi Redmi Note 12 Pro", category: xiaomiId, description: "Sạc nhanh 67W, chip Dimensity xử lý mượt mà.", image: "uploads/xiaomi-redmi-note-12-pro-1775436938167.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 12", cameraBack: "50MP", cameraFront: "16MP", cpu: "Dimensity 1080", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47f1", colorName: "Đen", colorHex: "#000000", storageCapacity: "256GB", network: "5G", price: 6990000, isSale: true, salePrice: 6290000, stock: 50 }] },
            { _id: "69d93d088aca0f96fd9f47f2", name: "Xiaomi Redmi 12C", category: xiaomiId, description: "Camera kép 50MP, pin 5000mAh thoải mái dùng 2 ngày.", image: "uploads/xiaomi-redmi-12c-1775436957021.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.71 inch", os: "Android 12", cameraBack: "50MP", cameraFront: "5MP", cpu: "Helio G85", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47f3", colorName: "Xanh Dương", colorHex: "#0000ff", storageCapacity: "64GB", network: "4G", price: 2390000, isSale: false, salePrice: 0, stock: 120 }] },
            { _id: "69d93d088aca0f96fd9f47f4", name: "Xiaomi Poco X5 Pro", category: xiaomiId, description: "Chip rồng mạnh mẽ, thiết kế màu vàng viền đen chuẩn gaming.", image: "uploads/xiaomi-poco-x5-pro-1775437826223.webp", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 12", cameraBack: "108MP", cameraFront: "16MP", cpu: "Snapdragon 778G", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47f5", colorName: "Vàng", colorHex: "#ffd700", storageCapacity: "128GB", network: "5G", price: 7290000, isSale: true, salePrice: 6590000, stock: 40 }] },
            { _id: "69d93d088aca0f96fd9f47f6", name: "Xiaomi 12T", category: xiaomiId, description: "Siêu phẩm cận cao cấp, sạc siêu nhanh 120W.", image: "uploads/xiaomi-12t-1775439334570.jpg", rating: 0, numReviews: 0, sold: 0, specs: { screen: "6.67 inch", os: "Android 12", cameraBack: "108MP", cameraFront: "20MP", cpu: "Dimensity 8100 Ultra", battery: "5000 mAh" }, variants: [{ _id: "69d93d088aca0f96fd9f47f7", colorName: "Bạc", colorHex: "#c0c0c0", storageCapacity: "256GB", network: "5G", price: 11990000, isSale: false, salePrice: 0, stock: 30 }] },
            // ------------------ VIVO (12 MÁY CỐ ĐỊNH ID) ------------------
            {
                _id: "69d93d088aca0f96fd9f47f8", name: "Vivo X100 Ultra", category: vivoId,
                description: "Tuyệt tác camera 200MP Zeiss APO, chip Snapdragon 8 Gen 3 siêu khủng.",
                image: "uploads/vivo-x100-ultra-1775845103326.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 14", cameraBack: "200MP", cameraFront: "50MP", cpu: "Snapdragon 8 Gen 3", battery: "5500 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f47f9", colorName: "Titanium", colorHex: "#878681", storageCapacity: "512GB", network: "5G", price: 34990000, isSale: true, salePrice: 32990000, stock: 10 }]
            },
            {
                _id: "69d93d088aca0f96fd9f47fa", name: "Vivo X100 Pro", category: vivoId,
                description: "Đỉnh cao nhiếp ảnh di động kết hợp cùng ZEISS, zoom tiềm vọng.",
                image: "uploads/vivo-x100-pro-1775845144238.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9300", battery: "5400 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f47fb", colorName: "Cam", colorHex: "#ff8c00", storageCapacity: "512GB", network: "5G", price: 29990000, isSale: true, salePrice: 28500000, stock: 15 }]
            },
            {
                _id: "69d93d088aca0f96fd9f47fc", name: "Vivo X100", category: vivoId,
                description: "Hiệu năng bùng nổ Dimensity 9300, sạc siêu tốc 120W.",
                image: "uploads/vivo-x100-1775845200370.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9300", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f47fd", colorName: "Xanh ngọc", colorHex: "#7fffd4", storageCapacity: "256GB", network: "5G", price: 22990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                _id: "69d93d088aca0f96fd9f47fe", name: "Vivo X Fold3 Pro", category: vivoId,
                description: "Điện thoại gập siêu mỏng nhẹ, pin trâu nhất thế giới gập.",
                image: "uploads/vivo-x-fold3-pro-1775845059377.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "8.03 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 3", battery: "5700 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f47ff", colorName: "Trắng sương", colorHex: "#f0f8ff", storageCapacity: "512GB", network: "5G", price: 39990000, isSale: true, salePrice: 38500000, stock: 8 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4800", name: "Vivo X Fold3", category: vivoId,
                description: "Gập mở linh hoạt, bản lề hàng không vũ trụ siêu bền.",
                image: "uploads/vivo-x-fold3-1775844930116.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "8.03 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 2", battery: "5500 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4801", colorName: "Đen nhám", colorHex: "#222222", storageCapacity: "256GB", network: "5G", price: 31990000, isSale: false, salePrice: 0, stock: 12 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4802", name: "Vivo X90 Pro+", category: vivoId,
                description: "Cảm biến 1 inch siêu to khổng lồ, vua camera đêm.",
                image: "uploads/vivo-x90-pro-1775844991842.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 2", battery: "4700 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4803", colorName: "Đỏ da", colorHex: "#8b0000", storageCapacity: "256GB", network: "5G", price: 25990000, isSale: true, salePrice: 24500000, stock: 10 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4804", name: "Vivo X90 Pro", category: vivoId,
                description: "Cấu hình đẳng cấp, màn hình AMOLED 120Hz rực rỡ.",
                image: "uploads/vivo-x90-pro-1775845240728.png", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9200", battery: "4870 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4805", colorName: "Đen huyền", colorHex: "#000000", storageCapacity: "256GB", network: "5G", price: 21990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4806", name: "Vivo X Note", category: vivoId,
                description: "Màn hình khổng lồ 7 inch cho doanh nhân, bảo mật vân tay siêu âm.",
                image: "uploads/vivo-x-note-1775844961724.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "7.0 inch", os: "Funtouch OS 12", cameraBack: "50MP", cameraFront: "16MP", cpu: "Snapdragon 8 Gen 1", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4807", colorName: "Xanh dương", colorHex: "#00008b", storageCapacity: "256GB", network: "5G", price: 23990000, isSale: true, salePrice: 21500000, stock: 10 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4808", name: "Vivo X80 Pro", category: vivoId,
                description: "Định hình lại quay phim điện ảnh trên smartphone với Zeiss.",
                image: "uploads/vivo-x80-pro-1775844786250.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 12", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 1", battery: "4700 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4809", colorName: "Cam da", colorHex: "#ff7f50", storageCapacity: "256GB", network: "5G", price: 19990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                _id: "69d93d088aca0f96fd9f480a", name: "iQOO 12 Pro", category: vivoId,
                description: "Quái thú gaming từ Vivo, màn 2K 144Hz cực mượt.",
                image: "uploads/iqoo-12-pro-1775844855470.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "16MP", cpu: "Snapdragon 8 Gen 3", battery: "5100 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f480b", colorName: "BMW Legend", colorHex: "#ffffff", storageCapacity: "512GB", network: "5G", price: 23990000, isSale: true, salePrice: 22500000, stock: 15 }]
            },
            {
                _id: "69d93d088aca0f96fd9f480c", name: "iQOO 12", category: vivoId,
                description: "Hiệu năng eSports vượt trội, tản nhiệt buồng hơi khổng lồ.",
                image: "uploads/iqoo-12-1775845274700.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 14", cameraBack: "50MP", cameraFront: "16MP", cpu: "Snapdragon 8 Gen 3", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f480d", colorName: "Đen nhám", colorHex: "#222222", storageCapacity: "256GB", network: "5G", price: 19990000, isSale: false, salePrice: 0, stock: 22 }]
            },
            {
                _id: "69d93d088aca0f96fd9f480e", name: "iQOO 11S", category: vivoId,
                description: "Sạc nhanh 200W vô địch, cấu hình tối ưu chơi game.",
                image: "uploads/iqoo-11s-1775845310667.webp", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "Funtouch OS 13", cameraBack: "50MP", cameraFront: "16MP", cpu: "Snapdragon 8 Gen 2", battery: "4700 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f480f", colorName: "Xanh Track", colorHex: "#2e8b57", storageCapacity: "256GB", network: "5G", price: 17990000, isSale: true, salePrice: 16500000, stock: 18 }]
            },

            // ------------------ OPPO (12 MÁY CỐ ĐỊNH ID) ------------------
            {
                _id: "69d93d088aca0f96fd9f4810", name: "Oppo Find X7 Ultra", category: oppoId,
                description: "Camera kép tele tiềm vọng đầu tiên thế giới, Hasselblad tinh chỉnh.",
                image: "uploads/oppo-find-x7-ultra-1775845745132.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.82 inch", os: "ColorOS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 3", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4811", colorName: "Xanh biển", colorHex: "#000080", storageCapacity: "512GB", network: "5G", price: 31990000, isSale: true, salePrice: 30500000, stock: 12 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4812", name: "Oppo Find X7", category: oppoId,
                description: "Thiết kế cao cấp, chip Dimensity 9300 mạnh mẽ.",
                image: "uploads/oppo-find-x7-1775845710341.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "ColorOS 14", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9300", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4813", colorName: "Đen sao", colorHex: "#111111", storageCapacity: "256GB", network: "5G", price: 23990000, isSale: false, salePrice: 0, stock: 18 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4814", name: "Oppo Find N3", category: oppoId,
                description: "Kiệt tác màn hình gập mỏng nhẹ nhất của hãng, nếp gấp vô hình.",
                image: "uploads/oppo-find-n3-1775845823445.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "7.82 inch", os: "ColorOS 13.2", cameraBack: "48MP", cameraFront: "20MP", cpu: "Snapdragon 8 Gen 2", battery: "4805 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4815", colorName: "Vàng hồng", colorHex: "#ffb6c1", storageCapacity: "512GB", network: "5G", price: 44990000, isSale: true, salePrice: 42990000, stock: 8 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4816", name: "Oppo Find N3 Flip", category: oppoId,
                description: "Cụm 3 camera sau đỉnh cao lần đầu tiên trên điện thoại nắp gập.",
                image: "uploads/oppo-find-n3-flip-1775845675994.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.8 inch", os: "ColorOS 13.2", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9200", battery: "4300 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4817", colorName: "Đen bóng", colorHex: "#000000", storageCapacity: "256GB", network: "5G", price: 22990000, isSale: false, salePrice: 0, stock: 15 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4818", name: "Oppo Find X6 Pro", category: oppoId,
                description: "Mặt lưng da cực sang trọng, camera lấy nét cực nhanh với chip Marisilicon.",
                image: "uploads/oppo-find-x6-pro-1775845508928.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.82 inch", os: "ColorOS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 2", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4819", colorName: "Nâu da", colorHex: "#a52a2a", storageCapacity: "256GB", network: "5G", price: 26990000, isSale: true, salePrice: 25500000, stock: 10 }]
            },
            {
                _id: "69d93d088aca0f96fd9f481a", name: "Oppo Find X6", category: oppoId,
                description: "Màn hình hiển thị chân thực 1 tỷ màu, tối ưu cho nhiếp ảnh nghệ thuật.",
                image: "uploads/oppo-find-x6-1775845608413.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.74 inch", os: "ColorOS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9200", battery: "4800 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f481b", colorName: "Xanh rêu", colorHex: "#00ff7f", storageCapacity: "256GB", network: "5G", price: 19990000, isSale: false, salePrice: 0, stock: 20 }]
            },
            {
                _id: "69d93d088aca0f96fd9f481c", name: "Oppo Find X5 Pro", category: oppoId,
                description: "Thiết kế mặt lưng gốm nguyên khối liền mạch, cực kỳ độc đáo và bền bỉ.",
                image: "uploads/oppo-find-x5-pro-1775845870309.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.7 inch", os: "ColorOS 12.1", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8 Gen 1", battery: "5000 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f481d", colorName: "Trắng gốm", colorHex: "#f8f8ff", storageCapacity: "256GB", network: "5G", price: 17990000, isSale: true, salePrice: 15500000, stock: 10 }]
            },
            {
                _id: "69d93d088aca0f96fd9f481e", name: "Oppo Find N2", category: oppoId,
                description: "Gập mở tiện lợi, thiết kế gọn gàng bỏ túi hoàn hảo.",
                image: "uploads/oppo-find-n2-1775845559572.png", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "7.1 inch", os: "ColorOS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 8+ Gen 1", battery: "4520 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f481f", colorName: "Xanh lá", colorHex: "#008000", storageCapacity: "256GB", network: "5G", price: 32990000, isSale: false, salePrice: 0, stock: 5 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4820", name: "Oppo Find N2 Flip", category: oppoId,
                description: "Màn hình ngoài dọc lớn nhất, thao tác nhanh không cần mở máy.",
                image: "uploads/oppo-find-n2-flip-1775845405605.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.8 inch", os: "ColorOS 13", cameraBack: "50MP", cameraFront: "32MP", cpu: "Dimensity 9000+", battery: "4300 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4821", colorName: "Tím nhạt", colorHex: "#e6e6fa", storageCapacity: "256GB", network: "5G", price: 16990000, isSale: true, salePrice: 14500000, stock: 25 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4822", name: "Oppo Ace 3 Pro", category: oppoId,
                description: "Siêu phẩm gaming, tản nhiệt hàng không vũ trụ mới.",
                image: "uploads/oppo-ace-3-pro-1775845470742.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.78 inch", os: "ColorOS 14", cameraBack: "50MP", cameraFront: "16MP", cpu: "Snapdragon 8 Gen 3", battery: "6100 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4823", colorName: "Bạc gốm", colorHex: "#c0c0c0", storageCapacity: "512GB", network: "5G", price: 18990000, isSale: false, salePrice: 0, stock: 30 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4824", name: "Oppo Find X3 Pro", category: oppoId,
                description: "Màn hình 1 tỷ màu siêu thực, camera kính hiển vi độc lạ.",
                image: "uploads/oppo-find-x3-pro-1775845922124.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.7 inch", os: "ColorOS 11.2", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 888", battery: "4500 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4825", colorName: "Xanh lam", colorHex: "#0000ff", storageCapacity: "256GB", network: "5G", price: 14990000, isSale: true, salePrice: 13500000, stock: 15 }]
            },
            {
                _id: "69d93d088aca0f96fd9f4826", name: "Oppo Find X5", category: oppoId,
                description: "Hiệu năng mạnh mẽ với chip Snapdragon 888, sạc 80W.",
                image: "uploads/oppo-find-x5-1775845974684.jpg", rating: 0, numReviews: 0, sold: 0,
                specs: { screen: "6.55 inch", os: "ColorOS 12.1", cameraBack: "50MP", cameraFront: "32MP", cpu: "Snapdragon 888", battery: "4800 mAh" },
                variants: [{ _id: "69d93d088aca0f96fd9f4827", colorName: "Đen mờ", colorHex: "#333333", storageCapacity: "256GB", network: "5G", price: 12990000, isSale: false, salePrice: 0, stock: 20 }]
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