// Format price
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify session
    const session = checkSession();
    if (!session) return; // checkSession will redirect

    // 2. Verification of Admin Role (RBAC) - Local First
    if (session.user.role_id !== 1) {
        alert("Bạn không có quyền truy cập trang quản trị!");
        window.location.href = './index.html';
        return;
    }

    const adminDisplay = document.getElementById('admin-info-display');
    if (adminDisplay) {
        adminDisplay.innerHTML = `<i class="fa-solid fa-circle-user text-accent me-1"></i> Admin: <strong>${session.user.fullName}</strong>`;
    }

    // Background sync check with Firestore (non-blocking)
    if (session.user.uid && !session.user.uid.startsWith('local_')) {
        db.collection("users").doc(session.user.uid).get().then(doc => {
            if (doc.exists && doc.data().role_id !== 1) {
                alert("Quyền quản trị của bạn đã bị thu hồi từ server!");
                window.location.href = './index.html';
            }
        }).catch(e => {
            console.log("Offline mode: Bỏ qua check Role Firebase.");
        });
    }

    // 3. Load cars to table
    loadCars();

    // 4. Handle form submission (Add/Edit car)
    document.getElementById('car-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const editingId = document.getElementById('editingId').value;
        const brand = document.getElementById('car-brand').value.trim();
        const model = document.getElementById('car-model').value.trim();
        const year = parseInt(document.getElementById('car-year').value);
        const stock = parseInt(document.getElementById('car-stock').value);
        const price = parseInt(document.getElementById('car-price').value);
        const type = document.getElementById('car-type').value;
        const fuelType = document.getElementById('car-fuel').value;
        const transmission = document.getElementById('car-transmission').value;
        const desc = document.getElementById('car-desc').value.trim();
        
        // Handle custom image URL vs select dropdown value
        const imageSelect = document.getElementById('car-image').value;
        const imageCustom = document.getElementById('car-image-custom').value.trim();
        const image = imageCustom ? imageCustom : imageSelect;

        if (!brand || !model || isNaN(year) || isNaN(stock) || isNaN(price)) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        const carData = {
            brand,
            model,
            year,
            stock,
            price,
            type,
            fuelType,
            transmission,
            description: desc,
            image
        };

        if (editingId) {
            // Update mode
            window.LocalDB.update('cars', editingId, carData);
            alert("Cập nhật thông tin xe thành công!");
        } else {
            // Add mode
            window.LocalDB.add('cars', carData);
            alert("Thêm xe mới thành công!");
        }

        resetCarForm();
        loadCars();
    });
});

// Load cars list in admin panel table
function loadCars() {
    const tableBody = document.getElementById('admin-car-list');
    if (!tableBody) return;

    const cars = window.LocalDB.get('cars');
    // Sort by newest first
    cars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (cars.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fa-solid fa-car-side me-2"></i>Không có xe nào trong kho.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = cars.map((car, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <img src="${car.image || 'src/img/car1.png'}" alt="car img" class="rounded" style="width: 80px; height: 60px; object-fit: cover;">
            </td>
            <td>
                <strong>${car.brand} ${car.model}</strong>
            </td>
            <td>${car.year}</td>
            <td class="text-danger fw-bold">${formatVND(car.price)}</td>
            <td><span class="badge bg-secondary">${car.type}</span></td>
            <td>
                <span class="badge ${car.stock > 0 ? 'bg-success' : 'bg-danger'}">${car.stock} xe</span>
            </td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-primary btn-sm py-1 px-2" onclick="editCarForm('${car.id}')" title="Sửa">
                        <i class="fa-solid fa-pen"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm py-1 px-2" onclick="deleteCar('${car.id}')" title="Xóa">
                        <i class="fa-solid fa-trash-can"></i> Xóa
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Fill form with editing car details
function editCarForm(carId) {
    const cars = window.LocalDB.get('cars');
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    document.getElementById('editingId').value = car.id;
    document.getElementById('car-brand').value = car.brand;
    document.getElementById('car-model').value = car.model;
    document.getElementById('car-year').value = car.year;
    document.getElementById('car-stock').value = car.stock;
    document.getElementById('car-price').value = car.price;
    document.getElementById('car-type').value = car.type;
    document.getElementById('car-fuel').value = car.fuelType;
    document.getElementById('car-transmission').value = car.transmission;
    document.getElementById('car-desc').value = car.description || '';

    // Handle Image Selector
    const imageSelect = document.getElementById('car-image');
    const imageCustom = document.getElementById('car-image-custom');
    
    // Check if image matches one of the preset models
    let optionMatched = false;
    for (let i = 0; i < imageSelect.options.length; i++) {
        if (imageSelect.options[i].value === car.image) {
            imageSelect.selectedIndex = i;
            optionMatched = true;
            break;
        }
    }

    if (optionMatched) {
        imageCustom.value = '';
    } else {
        imageCustom.value = car.image || '';
    }

    // Change Button labels for editing mode
    document.getElementById('form-title').textContent = "Cập nhật thông tin xe";
    document.getElementById('save-btn').textContent = "Cập nhật";
    document.getElementById('cancel-btn').textContent = "Hủy sửa";
}

// Reset form fields
function resetCarForm() {
    document.getElementById('editingId').value = '';
    document.getElementById('car-form').reset();
    
    document.getElementById('form-title').textContent = "Thêm xe mới vào kho";
    document.getElementById('save-btn').textContent = "Lưu thông tin";
    document.getElementById('cancel-btn').textContent = "Nhập lại";
}

// Delete a car
function deleteCar(carId) {
    // 1. Check if there are active bookings (status 0: pending, 1: deposit paid)
    const orders = window.LocalDB.get('orders');
    const activeOrders = orders.filter(o => o.carId === carId && (o.status === 0 || o.status === 1));

    if (activeOrders.length > 0) {
        alert("Không thể xóa xe này vì đang có đơn đặt cọc chưa hoàn thành (chờ thanh toán hoặc đã cọc) liên quan đến xe!");
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa mẫu xe này ra khỏi showroom? Hành động này không thể hoàn tác.")) {
        return;
    }

    window.LocalDB.remove('cars', carId);
    alert("Đã xóa xe khỏi kho!");
    loadCars();
}

// Logout handler
function adminLogout(e) {
    if (e) e.preventDefault();
    if (confirm("Đăng xuất khỏi hệ thống quản trị?")) {
        try {
            if (typeof auth !== 'undefined') {
                auth.signOut();
            }
        } catch(err){}
        localStorage.removeItem('user_session');
        window.location.href = './index.html';
    }
}
