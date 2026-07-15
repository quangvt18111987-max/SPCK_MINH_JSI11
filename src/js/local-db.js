// LocalDB Utility Wrapper for localStorage
window.LocalDB = {
    get(collection) {
        try {
            const data = localStorage.getItem(collection);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("LocalDB Get Error:", e);
            return [];
        }
    },

    set(collection, data) {
        try {
            localStorage.setItem(collection, JSON.stringify(data));
        } catch (e) {
            console.error("LocalDB Set Error:", e);
        }
    },

    add(collection, item) {
        const data = this.get(collection);
        // Generate a unique ID
        item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        item.createdAt = Date.now();
        data.push(item);
        this.set(collection, data);
        return item;
    },

    update(collection, id, updates) {
        const data = this.get(collection);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedAt: Date.now() };
            this.set(collection, data);
            return data[index];
        }
        return null;
    },

    remove(collection, id) {
        const data = this.get(collection);
        const filtered = data.filter(item => item.id !== id);
        this.set(collection, filtered);
        return true;
    },

    init() {
        // Seed default cars if 'cars' collection doesn't exist or is empty
        if (this.get('cars').length === 0) {
            const defaultCars = [
                {
                    id: "car_1",
                    brand: "Toyota",
                    model: "Camry 2.5Q",
                    year: 2024,
                    price: 1370000000,
                    type: "Sedan",
                    color: "Đen",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car1.png",
                    stock: 3,
                    description: "Mẫu sedan hạng D sang trọng, động cơ mạnh mẽ và trang bị cao cấp hàng đầu phân khúc.",
                    createdAt: Date.now()
                },
                {
                    id: "car_2",
                    brand: "Honda",
                    model: "CR-V L-G",
                    year: 2024,
                    price: 1109000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car2.png",
                    stock: 4,
                    description: "SUV 7 chỗ rộng rãi, công nghệ an toàn Honda SENSING tiên tiến.",
                    createdAt: Date.now() - 1000
                },
                {
                    id: "car_3",
                    brand: "Ford",
                    model: "Ranger Wildtrak",
                    year: 2024,
                    price: 979000000,
                    type: "Pickup",
                    color: "Cam",
                    fuelType: "Dầu",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car3.png",
                    stock: 5,
                    description: "Vua bán tải mạnh mẽ, tiện nghi như xe SUV hạng sang, sẵn sàng chinh phục mọi địa hình.",
                    createdAt: Date.now() - 2000
                },
                {
                    id: "car_4",
                    brand: "Hyundai",
                    model: "Tucson 2.0 L",
                    year: 2024,
                    price: 845000000,
                    type: "SUV",
                    color: "Đỏ",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car4.png",
                    stock: 2,
                    description: "Thiết kế tương lai mang đậm tính thể thao, nội thất nhiều trang bị tiện nghi hiện đại.",
                    createdAt: Date.now() - 3000
                },
                {
                    id: "car_5",
                    brand: "Mazda",
                    model: "CX-5 Premium",
                    year: 2024,
                    price: 829000000,
                    type: "SUV",
                    color: "Xanh",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car5.png",
                    stock: 3,
                    description: "Phong cách KODO tinh tế, vận hành êm ái cùng công nghệ SkyActiv danh tiếng.",
                    createdAt: Date.now() - 4000
                },
                {
                    id: "car_6",
                    brand: "Kia",
                    model: "Seltos Premium",
                    year: 2024,
                    price: 739000000,
                    type: "SUV",
                    color: "Vàng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car6.png",
                    stock: 3,
                    description: "SUV đô thị năng động, trẻ trung, trang bị ngập tràn phân khúc.",
                    createdAt: Date.now() - 5000
                },
                {
                    id: "car_7",
                    brand: "Mercedes-Benz",
                    model: "C200 Avantgarde",
                    year: 2024,
                    price: 1599000000,
                    type: "Sedan",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car7.png",
                    stock: 2,
                    description: "Đại diện sedan hạng sang cỡ nhỏ từ thương hiệu ngôi sao ba cánh danh tiếng.",
                    createdAt: Date.now() - 6000
                },
                {
                    id: "car_8",
                    brand: "BMW",
                    model: "320i Sport Line",
                    year: 2024,
                    price: 1399000000,
                    type: "Sedan",
                    color: "Đen",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car8.png",
                    stock: 2,
                    description: "Cảm giác lái thể thao vượt trội, thiết kế trẻ trung cá tính.",
                    createdAt: Date.now() - 7000
                },
                {
                    id: "car_9",
                    brand: "Audi",
                    model: "A4 Plus",
                    year: 2024,
                    price: 1800000000,
                    type: "Sedan",
                    color: "Xám",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car9.png",
                    stock: 2,
                    description: "Sedan gia đình sang trọng sở hữu hệ thống dẫn động 4 bánh trứ danh Quattro.",
                    createdAt: Date.now() - 8000
                },
                {
                    id: "car_10",
                    brand: "VinFast",
                    model: "VF 8 Plus",
                    year: 2024,
                    price: 1270000000,
                    type: "SUV",
                    color: "Xanh",
                    fuelType: "Điện",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car10.png",
                    stock: 4,
                    description: "SUV điện thông minh toàn cầu, công nghệ hỗ trợ lái ADAS cao cấp.",
                    createdAt: Date.now() - 9000
                },
                {
                    id: "car_11",
                    brand: "Porsche",
                    model: "911 Carrera",
                    year: 2024,
                    price: 7600000000,
                    type: "Sedan",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car11.png",
                    stock: 2,
                    description: "Huyền thoại xe thể thao đến từ Đức, thiết kế coupe vượt thời gian cùng hiệu suất đáng kinh ngạc.",
                    createdAt: Date.now() - 10000
                },
                {
                    id: "car_12",
                    brand: "Lexus",
                    model: "RX 350",
                    year: 2024,
                    price: 3430000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car12.png",
                    stock: 3,
                    description: "SUV hạng sang bán chạy nhất, nội thất tinh xảo, vận hành êm ái và cực kỳ bền bỉ.",
                    createdAt: Date.now() - 11000
                },
                {
                    id: "car_13",
                    brand: "Volvo",
                    model: "XC90 Recharge",
                    year: 2024,
                    price: 4650000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Hybrid",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car13.png",
                    stock: 2,
                    description: "An toàn bậc nhất thế giới, thiết kế Scandinavian thanh lịch đi kèm động cơ Hybrid mạnh mẽ.",
                    createdAt: Date.now() - 12000
                },
                {
                    id: "car_14",
                    brand: "Land Rover",
                    model: "Range Rover",
                    year: 2024,
                    price: 11189000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car14.png",
                    stock: 1,
                    description: "Biểu tượng của sự xa hoa và khả năng vượt địa hình tối thượng.",
                    createdAt: Date.now() - 13000
                },
                {
                    id: "car_15",
                    brand: "Toyota",
                    model: "Land Cruiser",
                    year: 2024,
                    price: 4286000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car15.png",
                    stock: 2,
                    description: "Ông vua địa hình, cực kỳ bền bỉ và giữ giá vô địch.",
                    createdAt: Date.now() - 14000
                },
                {
                    id: "car_16",
                    brand: "Ford",
                    model: "Everest Titanium",
                    year: 2024,
                    price: 1468000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Dầu",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car16.png",
                    stock: 5,
                    description: "SUV 7 chỗ cỡ trung cơ bắp, công nghệ ngập tràn và cách âm xuất sắc.",
                    createdAt: Date.now() - 15000
                },
                {
                    id: "car_17",
                    brand: "Kia",
                    model: "Carnival Signature",
                    year: 2024,
                    price: 1439000000,
                    type: "Sedan",
                    color: "Trắng",
                    fuelType: "Dầu",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car17.png",
                    stock: 4,
                    description: "Mẫu xe MPV cỡ lớn thực dụng nhất cho gia đình đông người, trang bị xịn sò.",
                    createdAt: Date.now() - 16000
                },
                {
                    id: "car_18",
                    brand: "VinFast",
                    model: "VF 9 Plus",
                    year: 2024,
                    price: 1566000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Điện",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car18.png",
                    stock: 3,
                    description: "SUV điện Full-size đẳng cấp nhất của VinFast, với thiết kế hiện đại và công nghệ tiên tiến.",
                    createdAt: Date.now() - 17000
                },
                {
                    id: "car_19",
                    brand: "Mercedes-Benz",
                    model: "G63 AMG",
                    year: 2024,
                    price: 11750000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car19.png",
                    stock: 1,
                    description: "Ông hoàng off-road mang thiết kế hộp vuông kinh điển và động cơ V8 cực kỳ bạo lực.",
                    createdAt: Date.now() - 18000
                },
                {
                    id: "car_20",
                    brand: "BMW",
                    model: "X7 xDrive40i",
                    year: 2024,
                    price: 6200000000,
                    type: "SUV",
                    color: "Trắng",
                    fuelType: "Xăng",
                    transmission: "Số tự động",
                    mileage: 0,
                    image: "src/img/car20.png",
                    stock: 2,
                    description: "Mẫu SUV hạng sang cỡ lớn (The President) cao cấp nhất của gia đình BMW.",
                    createdAt: Date.now() - 19000
                }
            ];
            this.set('cars', defaultCars);
            console.log("LocalDB: Seeded default cars.");
        }

        // Seed default users if 'users' collection doesn't exist or is empty
        if (this.get('users').length === 0) {
            const defaultUsers = [
                {
                    id: "admin_id",
                    email: "admin@carshop.com",
                    password: "123", // plaintext for demo purposes
                    role_id: 1, // 1 = Admin
                    fullName: "Hệ thống Quản trị",
                    phone: "0999999999",
                    deposit: 0
                }
            ];
            this.set('users', defaultUsers);
            console.log("LocalDB: Seeded default users (admin).");
        }

        // Initialize orders if empty
        if (!localStorage.getItem('orders')) {
            this.set('orders', []);
            console.log("LocalDB: Initialized empty orders.");
        }
    }
};

// Auto initialize on script load
window.LocalDB.init();
