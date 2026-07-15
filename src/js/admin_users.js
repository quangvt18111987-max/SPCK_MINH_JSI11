// Format price
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verify session
    const session = checkSession();
    if (!session) return;

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

    // 3. Load users
    loadUsers();
});

function loadUsers() {
    const tbody = document.getElementById('admin-user-list');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><i class="fa-solid fa-spinner fa-spin me-2 text-primary"></i>Đang lấy dữ liệu từ Firebase...</td></tr>';

    // Fetch from Firebase first
    db.collection("users").get().then(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        renderUsers(users, "Firebase Firestore Cloud");
    }).catch(error => {
        console.error("Lỗi lấy dữ liệu từ Firebase, fallback sang LocalDB:", error);
        // Fallback to LocalDB
        const localUsers = window.LocalDB.get('users');
        renderUsers(localUsers, "LocalDB (Chế độ Ngoại tuyến)");
    });
}

function renderUsers(users, sourceInfo) {
    const tbody = document.getElementById('admin-user-list');
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không có tài khoản nào trong hệ thống.</td></tr>`;
        return;
    }

    // Sắp xếp admin lên đầu, khách hàng phía dưới
    users.sort((a, b) => a.role_id - b.role_id);

    tbody.innerHTML = users.map((u, index) => {
        const roleBadge = u.role_id === 1 ? 
            '<span class="badge bg-danger">Admin</span>' : 
            '<span class="badge bg-primary">Khách Hàng</span>';
            
        return `
            <tr>
                <td>${index + 1}</td>
                <td><small class="text-muted" style="font-family: monospace;">${u.id}</small></td>
                <td class="fw-bold text-dark">${u.fullName || 'Chưa cập nhật'}</td>
                <td><i class="fa-regular fa-envelope me-1 text-muted"></i> ${u.email}</td>
                <td><i class="fa-solid fa-phone me-1 text-muted"></i> ${u.phone || 'Chưa cập nhật'}</td>
                <td class="text-success fw-bold">${formatVND(u.deposit || 0)}</td>
                <td>${roleBadge}</td>
            </tr>
        `;
    }).join('');

    // Update title to show data source
    const titleObj = document.querySelector('.admin-card h5');
    if (titleObj) {
        titleObj.innerHTML = `Danh sách tài khoản <small class="text-muted fs-6" style="font-weight:normal;">(Nguồn: <span class="text-primary">${sourceInfo}</span>)</small>`;
    }
}

// Logout handler
function adminLogout(e) {
    if (e) e.preventDefault();
    if (confirm("Đăng xuất khỏi hệ thống quản trị?")) {
        try {
            if (typeof auth !== 'undefined') auth.signOut();
        } catch(err){}
        localStorage.removeItem('user_session');
        window.location.href = './index.html';
    }
}
