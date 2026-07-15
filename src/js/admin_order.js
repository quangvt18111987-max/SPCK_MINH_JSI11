// Format currency helper
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

    // 3. Load dashboard statistics
    loadStats();

    // 4. Load initial orders list
    loadOrders('all');

    // 5. Bind filter change event
    const filterSelect = document.getElementById('filter-status');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            loadOrders(e.target.value);
        });
    }
});

// Load dashboard stats
function loadStats() {
    const orders = window.LocalDB.get('orders');

    // Get today boundary times
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    // Get current month boundary times
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total today orders
    const todayOrders = orders.filter(o => o.createdAt >= startOfToday.getTime() && o.createdAt <= endOfToday.getTime());
    document.getElementById('stat-today').textContent = todayOrders.length;

    // 2. Pending orders (status = 0)
    const pendingOrders = orders.filter(o => o.status === 0);
    document.getElementById('stat-pending').textContent = pendingOrders.length;

    // 3. Paid/Deposited orders (status = 1)
    const paidOrders = orders.filter(o => o.status === 1);
    document.getElementById('stat-paid').textContent = paidOrders.length;

    // 4. Revenue current month (Sum depositAmount of status = 1 and status = 2 created in current month)
    const monthlyRevenue = orders
        .filter(o => (o.status === 1 || o.status === 2) && o.createdAt >= startOfMonth.getTime())
        .reduce((sum, o) => sum + o.depositAmount, 0);
    
    document.getElementById('stat-revenue').textContent = formatVND(monthlyRevenue);

    // 5. Total Sales Revenue (Sum of car price for all delivered cars, status = 2)
    const cars = window.LocalDB.get('cars');
    const totalSalesRevenue = orders
        .filter(o => o.status === 2)
        .reduce((sum, o) => {
            const car = cars.find(c => c.id === o.carId);
            return sum + (car ? car.price : 0);
        }, 0);
    
    const totalRevenueEl = document.getElementById('stat-total-revenue');
    if (totalRevenueEl) totalRevenueEl.textContent = formatVND(totalSalesRevenue);
}

// Load and render orders table
function loadOrders(filterStatus = 'all') {
    const tableBody = document.getElementById('admin-order-list');
    if (!tableBody) return;

    let orders = window.LocalDB.get('orders');
    const cars = window.LocalDB.get('cars');

    // Filter by status if not 'all'
    if (filterStatus !== 'all') {
        const targetStatus = parseInt(filterStatus);
        orders = orders.filter(o => o.status === targetStatus);
    }

    // Sort by newest first
    orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fa-solid fa-receipt me-2"></i>Không có đơn đặt cọc nào phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = orders.map((order, index) => {
        const car = cars.find(c => c.id === order.carId);
        const carName = car ? `${car.brand} ${car.model}` : "Mẫu xe không xác định";
        const dateStr = new Date(order.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="fw-bold">${order.author}</div>
                </td>
                <td>${carName}</td>
                <td>${order.color}</td>
                <td class="text-danger fw-bold">${formatVND(order.depositAmount)}</td>
                <td>${dateStr}</td>
                <td>
                    ${getStatusLabel(order.status)}
                </td>
                <td>
                    <div class="d-flex flex-column gap-2 align-items-start">
                        <select class="form-select form-select-sm status-select" style="width: 170px;" onchange="updateOrderStatus('${order.id}', this.value, ${order.status})">
                            <option value="0" ${order.status === 0 ? 'selected' : ''}>Chờ thanh toán cọc</option>
                            <option value="1" ${order.status === 1 ? 'selected' : ''}>Đã cọc - Chờ giao xe</option>
                            <option value="2" ${order.status === 2 ? 'selected' : ''}>Đã nhận xe</option>
                            <option value="3" ${order.status === 3 ? 'selected' : ''}>Đã hủy</option>
                        </select>
                        ${order.status === 1 ? `<button class="btn btn-sm btn-success fw-bold shadow-sm" onclick="updateOrderStatus('${order.id}', 2, 1)"><i class="fa-solid fa-truck-fast me-1"></i> Giao xe ngay</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Get Badge UI for order status
function getStatusLabel(status) {
    switch (status) {
        case 0:
            return '<span class="badge bg-warning text-dark">Chờ thanh toán</span>';
        case 1:
            return '<span class="badge bg-primary">Đã cọc (Chờ giao)</span>';
        case 2:
            return '<span class="badge bg-success">Đã nhận xe</span>';
        case 3:
            return '<span class="badge bg-secondary">Đã hủy</span>';
        default:
            return '<span class="badge bg-light text-dark">Không xác định</span>';
    }
}

// Handle Order Status updates & inventory adjustments
function updateOrderStatus(orderId, newStatusVal, oldStatus) {
    const newStatus = parseInt(newStatusVal);
    if (newStatus === oldStatus) return;

    const orders = window.LocalDB.get('orders');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert("Không tìm thấy đơn hàng!");
        loadOrders(document.getElementById('filter-status').value);
        return;
    }

    const cars = window.LocalDB.get('cars');
    const car = cars.find(c => c.id === order.carId);

    // Stock Adjustment Logic
    if (car) {
        // Case 1: Old status is active (0, 1) or delivered (2) -> New status is Cancelled (3)
        if ((oldStatus === 0 || oldStatus === 1 || oldStatus === 2) && newStatus === 3) {
            window.LocalDB.update('cars', car.id, { stock: car.stock + 1 });
            alert("Trạng thái chuyển sang Hủy. Đã hoàn trả lại số lượng tồn kho (+1) cho xe.");
        }
        // Case 2: Old status was Cancelled (3) -> New status is active (0, 1, 2)
        else if (oldStatus === 3 && (newStatus === 0 || newStatus === 1 || newStatus === 2)) {
            // Must check if stock is available
            if (car.stock <= 0) {
                alert("Không thể phục hồi đơn đặt cọc! Mẫu xe này hiện đã hết hàng tồn kho.");
                // Revert select dropdown value
                loadOrders(document.getElementById('filter-status').value);
                return;
            }
            window.LocalDB.update('cars', car.id, { stock: car.stock - 1 });
            alert("Trạng thái chuyển sang Hoạt động. Đã trừ bớt số lượng tồn kho (-1) của xe.");
        }
    }

    // Update the order status in database
    window.LocalDB.update('orders', orderId, { status: newStatus });
    
    alert("Cập nhật trạng thái đơn hàng thành công!");

    // Refresh dashboards and list
    loadStats();
    loadOrders(document.getElementById('filter-status').value);
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
