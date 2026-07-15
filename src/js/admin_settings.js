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

    // Populate profile form
    document.getElementById('admin-name').value = session.user.fullName || '';

    // Handle profile update
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('admin-name').value.trim();
        const newPassword = document.getElementById('admin-password').value;

        const updates = { fullName: newName };
        if (newPassword) {
            updates.password = newPassword;
        }

        window.LocalDB.update('users', session.user.id, updates);
        
        // Update session
        session.user.fullName = newName;
        if (newPassword) session.user.password = newPassword;
        localStorage.setItem('user_session', JSON.stringify(session));

        alert("Cập nhật hồ sơ thành công!");
        window.location.reload();
    });

    // Handle store config and deposit form (Mock forms)
    document.getElementById('store-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Đã lưu thông tin cửa hàng thành công! (Dữ liệu đã được lưu cục bộ)");
    });

    document.getElementById('deposit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Đã cập nhật cấu hình đặt cọc thành công! (Dữ liệu đã được lưu cục bộ)");
    });
});

// Danger Zone: Restore original cars
function resetDatabase() {
    if (confirm("Hành động này sẽ xóa toàn bộ danh sách xe hiện tại và khôi phục về 20 mẫu xe gốc ban đầu. Bạn có chắc chắn không?")) {
        // Xóa hoàn toàn dữ liệu cars trong localStorage
        localStorage.removeItem('cars'); 
        
        // Gọi lại hàm init() để hệ thống tự động chèn lại 20 xe mặc định
        window.LocalDB.init();
        
        alert("Khôi phục danh sách 20 xe mặc định thành công!");
        window.location.href = './admin.html';
    }
}

// Danger Zone: Clear everything
function clearAllData() {
    if (confirm("CẢNH BÁO NGUY HIỂM: Hành động này sẽ XÓA SẠCH toàn bộ dữ liệu (Người dùng, Đơn hàng, Xe). Bạn sẽ bị đăng xuất. Bạn có CHẮC CHẮN không?")) {
        localStorage.removeItem('carshop_cars');
        localStorage.removeItem('carshop_users');
        localStorage.removeItem('carshop_orders');
        
        // Sign out
        localStorage.removeItem('user_session');
        alert("Đã dọn dẹp toàn bộ dữ liệu hệ thống!");
        window.location.href = './index.html';
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
