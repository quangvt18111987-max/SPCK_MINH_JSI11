// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Render list of cars
function getCarList(container, limit = null) {
    if (!container) return;

    let cars = window.LocalDB.get('cars');
    // Sort cars by createdAt DESC (newest first)
    cars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (limit) {
        cars = cars.slice(0, limit);
    }

    if (cars.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-car-tunnel text-muted" style="font-size: 3rem;"></i>
                <p class="text-grey mt-3">Không tìm thấy xe nào trong kho.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cars.map(car => `
        <div class="col-md-4 mb-4">
            <div class="car-item h-100">
                <img src="${car.image || 'src/img/car1.png'}" alt="${car.brand} ${car.model}">
                <div class="car-item-body">
                    <span class="badge mb-2">${car.type}</span>
                    <h4>${car.brand} ${car.model} (${car.year})</h4>
                    <p class="price mb-2">${formatPrice(car.price)}</p>
                    <p class="details mb-3">
                        <i class="fa-solid fa-gears me-1"></i> ${car.transmission} | 
                        <i class="fa-solid fa-gas-pump me-1"></i> ${car.fuelType} | 
                        Còn ${car.stock} xe
                    </p>
                    <button class="btn-primary booking-btn mt-auto" onclick="openBookingForm('${car.id}')" ${car.stock <= 0 ? 'disabled' : ''}>
                        ${car.stock > 0 ? 'Đặt cọc ngay' : 'Hết hàng'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open booking modal
function openBookingForm(carId) {
    // Check session first (handles expiry checking and redirecting)
    const session = typeof checkSession === 'function' ? checkSession() : null;
    if (!session) {
        if (typeof checkSession !== 'function') {
            alert("Vui lòng đăng nhập để thực hiện đặt cọc xe!");
            window.location.href = './login.html';
        }
        return;
    }

    const cars = window.LocalDB.get('cars');
    const car = cars.find(c => c.id === carId);
    if (!car) {
        alert("Không tìm thấy xe!");
        return;
    }

    if (car.stock <= 0) {
        alert("Xin lỗi, mẫu xe này đã hết hàng!");
        return;
    }

    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="row mb-3">
            <div class="col-sm-4">
                <img src="${car.image || 'src/img/car1.png'}" class="img-fluid rounded shadow-sm" style="object-fit: cover; max-height: 120px;">
            </div>
            <div class="col-sm-8">
                <h5 class="m-0 text-primary">${car.brand} ${car.model}</h5>
                <p class="text-accent fw-bold my-1">${formatPrice(car.price)}</p>
                <p class="text-grey my-0" style="font-size: 0.85rem;">Năm sản xuất: ${car.year} | Nhiên liệu: ${car.fuelType}</p>
            </div>
        </div>
        
        <form id="modal-booking-form" onsubmit="submitBooking(event, '${car.id}')">
            <div class="mb-3">
                <label for="booking-color" class="form-label fw-bold">Chọn màu sắc ngoại thất:</label>
                <select id="booking-color" class="form-select" required>
                    <option value="Đen">Đen</option>
                    <option value="Trắng">Trắng</option>
                    <option value="Đỏ">Đỏ</option>
                    <option value="Xám">Xám</option>
                    <option value="Xanh">Xanh</option>
                </select>
            </div>
            
            <div class="mb-3">
                <label for="booking-note" class="form-label fw-bold">Ghi chú yêu cầu:</label>
                <textarea id="booking-note" class="form-select" rows="3" placeholder="Nhập yêu cầu thêm về phụ kiện, ưu đãi (nếu có)..."></textarea>
            </div>
            
            <div class="alert alert-warning py-2 px-3 mb-4 d-flex justify-content-between align-items-center">
                <span>Số tiền cọc tối thiểu:</span>
                <strong class="text-danger" style="font-size: 1.1rem;">50.000.000 ₫</strong>
            </div>
            
            <div class="d-flex gap-2">
                <button type="submit" class="btn-primary flex-grow-1">Xác nhận đặt cọc</button>
                <button type="button" class="btn-grey" onclick="closeBookingModal()">Đóng</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Submit booking form
function submitBooking(e, carId) {
    e.preventDefault();

    // Re-verify login session (handles expiry checking and redirecting)
    const session = typeof checkSession === 'function' ? checkSession() : null;
    if (!session) {
        if (typeof checkSession !== 'function') {
            alert("Vui lòng đăng nhập để thực hiện đặt cọc xe!");
            window.location.href = './login.html';
        }
        return;
    }

    const cars = window.LocalDB.get('cars');
    const car = cars.find(c => c.id === carId);
    if (!car) {
        alert("Không tìm thấy thông tin xe!");
        return;
    }

    if (car.stock <= 0) {
        alert("Mẫu xe này đã hết hàng trong kho!");
        return;
    }

    const color = document.getElementById('booking-color').value;
    const note = document.getElementById('booking-note').value.trim();

    const orderData = {
        author: session.user.email,
        carId: carId,
        color: color,
        note: note,
        depositAmount: 50000000,
        status: 0, // 0 = Chờ thanh toán cọc
        createdAt: Date.now()
    };

    // 1. Add order to LocalDB
    window.LocalDB.add('orders', orderData);

    // 2. Reduce car stock in LocalDB
    window.LocalDB.update('cars', carId, { stock: car.stock - 1 });

    alert("Đặt cọc thành công! Vui lòng thanh toán tiền cọc trong lịch sử đơn hàng để hoàn tất.");
    closeBookingModal();

    // 3. Refresh list (if container is present, such as in showroom or index)
    const featuredList = document.getElementById('featured-car-list');
    const showroomList = document.getElementById('showroom-car-list');
    if (featuredList) {
        getCarList(featuredList, 3);
    } else if (showroomList) {
        if (typeof filterCars === 'function') {
            filterCars(); // Re-trigger filter in showroom
        } else {
            getCarList(showroomList);
        }
    }
}
