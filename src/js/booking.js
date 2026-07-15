// Format price helper
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verify session
    const session = checkSession();
    if (!session) return; // checkSession will redirect

    // 2. Initial load
    loadBookingData(session);
});

// Load booking list and checkout summary
async function loadBookingData(session) {
    const email = session.user.email;
    const container = document.getElementById('booking-list');
    const checkoutContainer = document.getElementById('checkout-section');
    if (!container || !checkoutContainer) return;

    // Get orders and cars
    const orders = window.LocalDB.get('orders');
    const cars = window.LocalDB.get('cars');

    // Filter orders for current user
    const userOrders = orders.filter(o => o.author === email);
    // Sort by newest first
    userOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Get current user deposit status from LocalDB
    const users = window.LocalDB.get('users');
    const currentUser = users.find(u => u.email === email);
    const userDeposit = currentUser ? currentUser.deposit : 0;

    // Render booking list
    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 bg-white rounded-md shadow-sm">
                <i class="fa-solid fa-receipt text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-secondary">Bạn chưa có đơn đặt cọc nào.</h5>
                <p class="text-grey mb-3">Hãy ghé qua showroom để xem các mẫu xe mới nhất!</p>
                <a href="./showroom.html" class="btn-primary text-decoration-none">Đi tới Showroom</a>
            </div>
        `;
        checkoutContainer.style.display = 'none';
        return;
    }

    checkoutContainer.style.display = 'block';

    container.innerHTML = userOrders.map(order => {
        const car = cars.find(c => c.id === order.carId);
        const carName = car ? `${car.brand} ${car.model}` : "Mẫu xe không xác định";
        const carImage = car ? car.image : "src/img/car1.png";
        
        let statusBadge = '';
        let actionButtons = '';

        // Status mapping
        switch(order.status) {
            case 0:
                statusBadge = '<span class="badge bg-warning text-dark"><i class="fa-solid fa-clock me-1"></i>Chờ thanh toán cọc</span>';
                actionButtons = `<button class="btn btn-outline-danger btn-sm" onclick="cancelOrder('${order.id}')"><i class="fa-solid fa-trash-can me-1"></i>Hủy đặt cọc</button>`;
                break;
            case 1:
                statusBadge = '<span class="badge bg-primary"><i class="fa-solid fa-circle-check me-1"></i>Đã cọc - Chờ giao xe</span>';
                actionButtons = `<span class="text-muted" style="font-size: 0.85rem;"><i class="fa-solid fa-truck-ramp-box me-1"></i>Đang chuẩn bị giao xe</span>`;
                break;
            case 2:
                statusBadge = '<span class="badge bg-success"><i class="fa-solid fa-circle-check me-1"></i>Đã nhận xe</span>';
                actionButtons = `<span class="text-success" style="font-size: 0.85rem;"><i class="fa-solid fa-smile me-1"></i>Giao dịch hoàn tất</span>`;
                break;
            case 3:
                statusBadge = '<span class="badge bg-secondary"><i class="fa-solid fa-ban me-1"></i>Đã hủy</span>';
                actionButtons = `<button class="btn btn-outline-secondary btn-sm" onclick="deleteHistoryOrder('${order.id}')"><i class="fa-solid fa-xmark me-1"></i>Xóa lịch sử</button>`;
                break;
        }

        const dateStr = new Date(order.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        return `
            <div class="col-12 mb-3">
                <div class="card border-0 shadow-sm p-3 rounded-md bg-white">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <img src="${carImage}" alt="${carName}" class="img-fluid rounded" style="object-fit: cover; height: 120px; width: 100%;">
                        </div>
                        <div class="col-md-9 mt-3 mt-md-0">
                            <div class="d-flex justify-content-between align-items-start flex-wrap">
                                <div>
                                    <h5 class="text-primary m-0">${carName}</h5>
                                    <small class="text-grey">Màu sắc: ${order.color} | Ngày đặt: ${dateStr}</small>
                                </div>
                                <div class="mt-2 mt-sm-0">${statusBadge}</div>
                            </div>
                            
                            ${order.note ? `
                                <div class="bg-light p-2 rounded mt-2 text-grey" style="font-size: 0.85rem;">
                                    <strong>Ghi chú:</strong> ${order.note}
                                </div>
                            ` : ''}

                            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                                <div>
                                    <span class="text-grey" style="font-size: 0.9rem;">Tiền cọc:</span>
                                    <strong class="text-danger ms-1">${formatVND(order.depositAmount)}</strong>
                                </div>
                                <div>
                                    ${actionButtons}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Calculate unpaid deposit
    const unpaidDeposit = userOrders
        .filter(o => o.status === 0)
        .reduce((sum, o) => sum + o.depositAmount, 0);

    // Render checkout summary
    if (unpaidDeposit > 0) {
        checkoutContainer.innerHTML = `
            <h5 class="text-primary mb-3"><i class="fa-solid fa-wallet me-2 text-accent"></i>Thanh toán cọc</h5>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-grey">Tổng đơn chờ cọc:</span>
                <strong class="text-dark">${userOrders.filter(o => o.status === 0).length} xe</strong>
            </div>
            <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                <span class="text-grey">Tổng tiền cọc cần trả:</span>
                <strong class="text-danger" style="font-size: 1.1rem;">${formatVND(unpaidDeposit)}</strong>
            </div>
            <div class="d-flex justify-content-between mb-4 bg-light p-2 rounded">
                <span class="text-grey">Số dư ví của bạn:</span>
                <strong class="text-primary">${formatVND(userDeposit)}</strong>
            </div>
            
            <button class="btn-primary w-100 py-2" onclick="payDeposits('${currentUser.id}', ${unpaidDeposit}, ${userDeposit})">
                Thanh toán cọc ngay
            </button>
            <div class="text-center mt-3">
                <a href="./deposit.html" class="text-accent text-decoration-none fw-bold" style="font-size: 0.9rem;">
                    <i class="fa-solid fa-plus-circle me-1"></i>Nạp thêm tiền vào ví
                </a>
            </div>
        `;
    } else {
        checkoutContainer.innerHTML = `
            <h5 class="text-primary mb-3"><i class="fa-solid fa-circle-check me-2 text-success"></i>Thanh toán cọc</h5>
            <p class="text-grey mb-3" style="font-size: 0.9rem;">Tất cả các đơn đặt cọc hiện tại của bạn đã được thanh toán đầy đủ.</p>
            <div class="bg-light p-3 rounded text-center">
                <span class="text-grey block" style="font-size: 0.85rem;">Số dư ví hiện tại:</span>
                <h4 class="text-primary fw-bold m-0 mt-1">${formatVND(userDeposit)}</h4>
            </div>
            <div class="text-center mt-3">
                <a href="./deposit.html" class="btn btn-outline-primary btn-sm w-100">Nạp thêm tiền vào ví</a>
            </div>
        `;
    }
}

// Cancel booking (delete order 0, restore stock)
function cancelOrder(orderId) {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt cọc xe này không? Dữ liệu tồn kho xe sẽ được hoàn trả lại.")) {
        return;
    }

    const orders = window.LocalDB.get('orders');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert("Không tìm thấy đơn hàng!");
        return;
    }

    const cars = window.LocalDB.get('cars');
    const car = cars.find(c => c.id === order.carId);

    // 1. Update order status to Cancelled (3) instead of removing
    window.LocalDB.update('orders', orderId, { status: 3 });

    // 2. Restore stock
    if (car) {
        window.LocalDB.update('cars', car.id, { stock: car.stock + 1 });
    }

    alert("Hủy đặt cọc thành công!");
    
    // Tự động tải lại trang để cập nhật UI
    window.location.reload();
}

// Delete history order (status 3)
function deleteHistoryOrder(orderId) {
    if (!confirm("Bạn có muốn xóa đơn đã hủy này khỏi lịch sử giao dịch không?")) {
        return;
    }

    window.LocalDB.remove('orders', orderId);
    alert("Đã xóa khỏi lịch sử!");

    // Tự động tải lại trang để cập nhật UI
    window.location.reload();
}

// Pay deposits using wallet balance
async function payDeposits(userId, amountToPay, currentBalance) {
    if (currentBalance < amountToPay) {
        alert("Số dư ví của bạn không đủ để thanh toán đặt cọc! Vui lòng nạp thêm tiền.");
        window.location.href = './deposit.html';
        return;
    }

    if (!confirm(`Xác nhận thanh toán ${formatVND(amountToPay)} đặt cọc từ ví điện tử của bạn?`)) {
        return;
    }

    const newDeposit = currentBalance - amountToPay;

    try {
        // 1. Update LocalDB user deposit
        window.LocalDB.update('users', userId, { deposit: newDeposit });

        // 2. Update all status=0 orders for this user to status=1 in LocalDB
        const orders = window.LocalDB.get('orders');
        const session = JSON.parse(localStorage.getItem('user_session'));
        const userEmail = session.user.email;

        orders.forEach(order => {
            if (order.author === userEmail && order.status === 0) {
                window.LocalDB.update('orders', order.id, { status: 1 });
            }
        });

        // 3. Sync Firestore user deposit (optional/fallback)
        // Dùng fire-and-forget thay vì await để tránh treo UI do Firestore timeout/retries
        db.collection("users").doc(userId).update({ deposit: newDeposit }).catch(e => {
            console.log("Offline mode: Bỏ qua đồng bộ Firestore.");
        });

        alert("Thanh toán tiền cọc thành công! Trạng thái đơn đặt cọc của bạn đã chuyển sang 'Đã cọc - Chờ giao xe'.");
        
        // Tự động tải lại trang để cập nhật UI
        window.location.reload();
    } catch (error) {
        console.error("Lỗi thanh toán cọc:", error);
        alert("Đã xảy ra lỗi cục bộ: " + error.message);
    }
}
