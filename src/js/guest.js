document.addEventListener('DOMContentLoaded', () => {
    // 1. Dropdown and session display
    renderAuthMenu();

    // 2. Hamburger menu mobile toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('active');
        });
    }
});

function renderAuthMenu() {
    const container = document.getElementById('author-menu-drd');
    if (!container) return;

    const sessionStr = localStorage.getItem('user_session');
    let session = null;

    if (sessionStr) {
        try {
            const parsed = JSON.parse(sessionStr);
            if (parsed && parsed.expiry && Date.now() < parsed.expiry) {
                session = parsed;
            } else {
                localStorage.removeItem('user_session');
            }
        } catch (e) {
            localStorage.removeItem('user_session');
        }
    }

    if (session) {
        const user = session.user;
        const isAdmin = user.role_id === 1;

        container.innerHTML = `
            <a class="nav-link dropdown-toggle text-white text-decoration-none" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-circle-user me-1 text-accent"></i> ${user.fullName}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown" style="background-color: #1a2535; border: 1px solid #2a3a50;">
                <li class="px-3 py-2 text-muted border-bottom border-secondary" style="font-size: 0.85rem; word-break: break-all;">
                    <strong class="text-white">${user.fullName}</strong><br>${user.email}
                </li>
                ${isAdmin ? `
                    <li><a class="dropdown-item text-white py-2" href="./admin.html"><i class="fa-solid fa-gauge me-2 text-accent"></i>Quản trị hệ thống</a></li>
                    <li><a class="dropdown-item text-white py-2" href="./admin_order.html"><i class="fa-solid fa-receipt me-2 text-accent"></i>Quản lý đơn cọc</a></li>
                ` : `
                    <li><a class="dropdown-item text-white py-2" href="./booking.html"><i class="fa-solid fa-car me-2 text-accent"></i>Đơn đặt cọc của tôi</a></li>
                    <li><a class="dropdown-item text-white py-2" href="./deposit.html"><i class="fa-solid fa-wallet me-2 text-accent"></i>Nạp tiền vào ví</a></li>
                `}
                <li><hr class="dropdown-divider border-secondary"></li>
                <li><a class="dropdown-item text-danger py-2" href="#" onclick="handleLogout(event)"><i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</a></li>
            </ul>
        `;

        // Load Bootstrap dropdown dynamically if BS is loaded (since Bootstrap 5 relies on JS for dropdown)
        // We include Bootstrap JS CDN dynamically to guarantee it works.
        ensureBootstrapJS();
    } else {
        container.innerHTML = `
            <a href="./login.html" class="btn btn-outline-light btn-sm px-3 ms-2"><i class="fa-solid fa-right-to-bracket me-1"></i> Đăng nhập</a>
        `;
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        // Sign out from Firebase if authenticated
        try {
            if (typeof auth !== 'undefined') {
                auth.signOut();
            }
        } catch (err) {
            console.error("Firebase signout error:", err);
        }
        localStorage.removeItem('user_session');
        alert("Đăng xuất thành công!");
        window.location.href = './index.html';
    }
}

function ensureBootstrapJS() {
    if (!document.querySelector('script[src*="bootstrap.bundle.min.js"]')) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
        document.body.appendChild(script);
    }
}
