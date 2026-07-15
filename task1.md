# 📋 TASK LIST — XÂY DỰNG WEB BÁN ÔTÔ

> **Tài liệu tham chiếu**: [JSI_CarShop_Project_Guide.md](./JSI_CarShop_Project_Guide.md)  
> **Mục đích**: Danh sách task chi tiết theo từng Phase để AI có thể làm theo từng bước, tạo ra một dự án web tương tự.  
> **Ngày tạo**: 10/06/2026  

---

## 🔑 QUY ƯỚC

- `[ ]` — Chưa làm
- `[/]` — Đang làm
- `[x]` — Hoàn thành
- **Tham chiếu Guide**: Mỗi task đều chỉ rõ section tương ứng trong `JSI_CarShop_Project_Guide.md`
- **Có thể thay thế**: Tên đại lý, dòng xe, màu sắc, hình ảnh, tên miền Firebase — tuỳ chỉnh cho dự án mới

---

## 📐 TỔNG QUAN KIẾN TRÚC (ĐỌC TRƯỚC KHI BẮT ĐẦU)

> [!IMPORTANT]
> AI phải hiểu rõ kiến trúc tổng thể trước khi code bất kỳ file nào.

**Dự án gồm 3 lớp chính:**

| Lớp | Công nghệ | Vai trò |
|-----|-----------|---------|
| **Frontend** | HTML5 + CSS3 + JS ES6 + Bootstrap 5 | 8 trang HTML, 3 file CSS, 13 file JS |
| **Local Database** | localStorage (wrapper: `window.LocalDB`) | Lưu trữ chính: cars, orders, users |
| **Cloud Services** | Firebase Auth + Firestore (compat v10) | Xác thực + sync user data (role, deposit) |

**3 nhóm người dùng:**

| Vai trò | `role_id` | Truy cập |
|---------|-----------|----------|
| Admin | `1` | Sidebar layout — quản lý xe & đơn đặt cọc |
| User | `2` | Header/Footer layout — xem showroom, đặt cọc, nạp ví |
| Chưa đăng nhập | — | Auth card layout — login/register |

**8 trang HTML cần tạo:**
`index.html`, `login.html`, `register.html`, `showroom.html`, `booking.html`, `deposit.html`, `admin.html`, `admin_order.html`

---

# ═══════════════════════════════════════════
# PHASE 0 — KHỞI TẠO DỰ ÁN
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Slide 4 — Cấu Trúc Thư Mục Dự Án
> **Mục tiêu**: Tạo skeleton thư mục + chuẩn bị tài nguyên

- [x] **0.1** Tạo cấu trúc thư mục:
  ```
  📁 project-root/
  ├── 📄 index.html
  ├── 📄 login.html
  ├── 📄 register.html
  ├── 📄 showroom.html
  ├── 📄 booking.html
  ├── 📄 deposit.html
  ├── 📄 admin.html
  ├── 📄 admin_order.html
  └── 📁 src/
      ├── 📁 css/
      │   ├── 📄 main.css
      │   ├── 📄 auth.css
      │   └── 📄 guest.css
      ├── 📁 js/
      │   ├── 📄 firebase-config.js
      │   ├── 📄 local-db.js
      │   ├── 📄 login.js
      │   ├── 📄 register.js
      │   ├── 📄 check_session.js
      │   ├── 📄 guest.js
      │   ├── 📄 get-car.js
      │   ├── 📄 booking.js
      │   ├── 📄 deposit.js
      │   ├── 📄 admin.js
      │   └── 📄 admin_order.js
      ├── 📁 img/
      │   ├── 📄 logo.png
      │   ├── 📄 header-bg.png
      │   └── 📄 footer-bg.jpg
      └── 📁 font/ (nếu dùng Font Awesome local)
  ```

- [x] **0.2** Chuẩn bị tài nguyên hình ảnh:
  - [x] Logo đại lý (logo.png)
  - [x] Ảnh hero banner showroom (header-bg.png)
  - [x] Ảnh nền footer (footer-bg.jpg)
  - [x] 10-15 ảnh xe ô tô — đặt trong `src/img/`

- [/] **0.3** Tạo Firebase project:
  - [ ] Vào [Firebase Console](https://console.firebase.google.com/) → tạo project mới
  - [ ] Bật **Authentication** → phương thức **Email/Password**
  - [ ] Tạo **Cloud Firestore** database
  - [x] Lấy **firebaseConfig** object (apiKey, authDomain, projectId...) *(file đã tạo, cần thay key thật)*

**✅ Điều kiện hoàn thành Phase 0:**
- Tất cả thư mục và file rỗng đã được tạo
- Có ít nhất 1 logo + 1 banner + 10 ảnh xe
- Firebase project đã tạo, có config object sẵn sàng

---

# ═══════════════════════════════════════════
# PHASE 1 — DESIGN SYSTEM & CSS FOUNDATION
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 1 — Thiết Kế Giao Diện & Wireframe
> **Mục tiêu**: Xây dựng hệ thống CSS nền tảng, tái sử dụng xuyên suốt dự án

### Task 1.1 — main.css (Design Tokens + Utilities)
- [x] **1.1.1** Định nghĩa CSS Variables (color tokens):
  ```css
  :root {
      --color-primary: #1a3a5c;       /* Navy Blue — brand chính */
      --color-danger: #c0392b;        /* Đỏ — nút xóa, cảnh báo */
      --color-primary-blur: rgba(26,58,92,0.85); /* Overlay */
      --color-black: #000;
      --color-white: #fff;
      --color-input-dark: #0d1b2a;    /* Dark Navy — input nền tối */
      --color-grey: #5c5c5e;
      --color-grey-light: #dcdcdc;
      --color-accent: #e8a020;        /* Vàng cam — highlight giá xe */
  }
  ```
- [x] **1.1.2** Import Google Fonts (Inter 400-700):
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  ```
- [x] **1.1.3** Reset toàn cục + base typography:
  ```css
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; }
  ```
- [x] **1.1.4** Tạo utility classes:
  - Buttons: `.btn-primary`, `.btn-danger`, `.btn-grey`, `.btn-cancel`
  - Border radius: `.rounded-sm` (4px), `.rounded-md` (8px)
  - Shadow: `.shadow-md`
  - Text color: `.text-primary`, `.text-danger`, `.text-accent`
  - Background: `.bg-primary`
- [x] **1.1.5** Tạo Sidebar styles (cho admin pages):
  - `.sidebar` — nền navy đậm, chữ trắng, chiều cao 100vh, position fixed
  - Menu items hover effect (highlight vàng)
  - Active link highlight

### Task 1.2 — guest.css (Customer Pages Styling)
- [x] **1.2.1** Header cố định:
  - `position: fixed; top: 0; width: 100%; z-index: 9`
  - Background bán trong suốt: `rgba(10,20,40,0.85)`
  - Logo bên trái, nav bên phải, hamburger cho mobile
- [x] **1.2.2** Hero Banner:
  - `min-height: 100vh`
  - `background-attachment: fixed` (parallax effect)
  - `background-size: cover; background-position: center`
  - Overlay text với heading 3rem + tagline + button CTA
- [x] **1.2.3** Car Cards:
  - Grid layout (Bootstrap `col-md-4`)
  - Ảnh `height: 220px; object-fit: cover`
  - Badge thể hiện loại xe (SUV / Sedan / Pickup...)
  - Giá nổi bật màu accent
  - Material-style dual box-shadow
  - Border-radius top: `8px 8px 0 0`
- [x] **1.2.4** Booking Form Modal:
  - `position: fixed; top: 0; left: 0; width: 100%; height: 100%`
  - Background overlay: `rgba(0,0,0,0.6)`
  - Content box centered: `position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%)`
  - `z-index: 10`
- [x] **1.2.5** Footer:
  - Background image (footer-bg.jpg)
  - 3 columns layout (About, Showroom Info, Contact)
  - Padding lớn (140px top/bottom)
- [x] **1.2.6** Responsive (mobile ≤ 575.98px):
  - `.hidden` class cho nav desktop
  - Hamburger icon hiện trên mobile
  - Flex-column cho car list
  - Footer stack thành 1 cột

### Task 1.3 — auth.css (Login/Register Styling)
- [x] **1.3.1** Auth container full-screen:
  - `width: 100%; min-height: 100vh`
  - Background image (ảnh showroom xe ban đêm)
  - `background-size: cover`
- [x] **1.3.2** Card glassmorphism:
  - Absolute center: `top: 50%; left: 50%; transform: translate(-50%,-50%)`
  - `width: 500px; padding: 32px 40px`
  - `background: rgba(0,0,0,0.82)` (semi-transparent đen)
  - `border-radius: 8px`
- [x] **1.3.3** Form inputs:
  - Nền tối mặc định: `#1a2535`
  - Focus → chuyển trắng: `background: #fff; color: #000`
  - Icon (Font Awesome) bên trái input
- [x] **1.3.4** Responsive: card full-width trên mobile

**✅ Điều kiện hoàn thành Phase 1:**
- 3 file CSS đã viết đầy đủ
- Mở bất kỳ HTML có include CSS → thấy font Inter, màu đúng palette
- Responsive hoạt động tại breakpoint 575.98px

---

# ═══════════════════════════════════════════
# PHASE 2 — FIREBASE & LOCAL DATABASE
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 3.1 (Firebase Config) + Bước 4 (LocalDB)
> **Mục tiêu**: Dựng 2 lớp data — Cloud (Firebase) và Local (localStorage)

### Task 2.1 — firebase-config.js
- [x] **2.1.1** Viết file khởi tạo Firebase:
  ```javascript
  const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "...",
      appId: "..."
  };
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();
  const auth = firebase.auth();
  ```
- [x] **2.1.2** Lưu ý: dùng Firebase **compat** SDK (v10.x), load qua CDN script tags trong HTML:
  ```html
  <script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore-compat.js"></script>
  ```

### Task 2.2 — local-db.js (LocalDB CRUD Wrapper)
- [x] **2.2.1** Tạo `window.LocalDB` object với 6 methods:
  - `get(collection)` → JSON.parse từ localStorage, trả về `[]` nếu rỗng
  - `set(collection, data)` → JSON.stringify vào localStorage
  - `add(collection, item)` → auto-generate ID (`Date.now() + Math.random().toString(36)`) → push → set
  - `update(collection, id, updates)` → findIndex → spread merge → set
  - `remove(collection, id)` → filter → set
  - `init()` → seed data nếu chưa có

- [x] **2.2.2** Viết seed data trong `init()`:
  - **cars** (10-15 items):
    ```
    {
      id, brand, model, year, price, type,
      color, fuelType, transmission, mileage,
      image, stock, description, createdAt
    }
    ```
    - `brand`: Toyota, Honda, Ford, Hyundai, Mazda, Kia, Mercedes, BMW
    - `model`: Camry, CR-V, Ranger, Tucson, CX-5, Seltos, C200, 320i...
    - `type`: Sedan / SUV / Pickup / Hatchback / MPV
    - `fuelType`: Xăng / Dầu / Hybrid / Điện
    - `transmission`: Số tự động / Số sàn
    - `price`: VNĐ (500.000.000 → 3.000.000.000)
    - `stock`: số lượng xe tồn kho (1 → 5)
  - **users** (1 admin mặc định):
    ```
    { id: "admin_id", email: "admin@carshop.com", password: "123", role_id: 1, deposit: 0 }
    ```
  - **orders**: `[]` (rỗng)

- [x] **2.2.3** Auto-init khi load:
  ```javascript
  window.LocalDB.init();
  // Chỉ seed nếu chưa có data → không ghi đè data hiện có
  ```

- [x] **2.2.4** Test LocalDB trong DevTools:
  - `LocalDB.add('cars', {brand: 'Test', model: 'X1', price: 600000000})`
  - `LocalDB.get('cars')` → thấy item mới
  - `LocalDB.update('cars', id, {price: 650000000})` → giá đổi
  - `LocalDB.remove('cars', id)` → item bị xóa

### Task 2.3 — check_session.js
- [x] **2.3.1** Viết function `checkSession()`:
  - Đọc `localStorage.getItem('user_session')` → parse JSON
  - Nếu `!userSession` → redirect `/login.html`
  - Nếu `Date.now() > userSession.expiry` → xóa session → redirect `/login.html`
  - Nếu hợp lệ → `console.log("Phiên còn hợp lệ")`

**✅ Điều kiện hoàn thành Phase 2:**
- `firebase-config.js` khởi tạo Firebase thành công (không lỗi console)
- `LocalDB.get('cars')` trả về mảng seed data với đầy đủ thuộc tính xe
- `checkSession()` redirect đúng khi chưa đăng nhập hoặc session hết hạn

---

# ═══════════════════════════════════════════
# PHASE 3 — AUTHENTICATION (Login & Register)
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 3 — Xây Dựng Hệ Thống Xác Thực
> **Mục tiêu**: Hoàn thành đăng ký, đăng nhập, phân quyền, session

### Task 3.1 — register.html + register.js
- [x] **3.1.1** Tạo `register.html`:
  - Include: Bootstrap CSS, Font Awesome, `main.css`, `auth.css`
  - Auth card container (giống wireframe Layout B trong Guide)
  - Form gồm: Họ tên, Email, Số điện thoại, Password, Confirm Password
  - Link "Đã có tài khoản? → login.html"
  - Script tags: Firebase SDKs → `firebase-config.js` → `register.js`

- [x] **3.1.2** Implement `register.js`:
  - Validate:
    - Tất cả fields không rỗng → alert lỗi
    - Số điện thoại đúng định dạng 10 chữ số → alert lỗi
    - Password === Confirm → alert "Mật khẩu không khớp"
  - Gọi `auth.createUserWithEmailAndPassword(email, password)`
  - Handle errors: `email-already-in-use`, `weak-password`
  - Nếu success → tạo Firestore doc:
    ```javascript
    db.collection("users").doc(user.uid).set({
        id: user.uid,
        fullName: name,
        phone: phone,
        email: email,
        password: password,  // Lưu plaintext (demo only)
        role_id: 2,          // User mặc định
        deposit: 0
    });
    ```
  - Alert "Đăng ký thành công" → redirect `/login.html`

### Task 3.2 — login.html + login.js
- [x] **3.2.1** Tạo `login.html`:
  - Auth card container (giống register nhưng chỉ Email + Password)
  - Link "Chưa có tài khoản? → register.html"
  - Script tags: Firebase SDKs → `firebase-config.js` → `local-db.js` → `login.js`

- [x] **3.2.2** Implement `login.js` — Login Flow:
  1. Auto-redirect nếu đã có session hợp lệ:
     ```javascript
     const userSession = JSON.parse(localStorage.getItem('user_session'));
     if (userSession && Date.now() < userSession.expiry) {
         window.location.href = '/index.html';
     }
     ```
  2. Submit form → validate email + password không rỗng
  3. `auth.signInWithEmailAndPassword(email, password)`
  4. Handle errors: `user-not-found`, `wrong-password`, `invalid-credential`
  5. Nếu success:
     - `db.collection('users').doc(user.uid).get()` → lấy `role_id`, `deposit`, `fullName`
     - Sync user vào LocalDB: tìm hoặc thêm user vào `LocalDB.users`
     - Tạo session object:
       ```javascript
       { user: { email, uid, role_id, fullName }, expiry: Date.now() + 2*60*60*1000 }
       ```
     - `localStorage.setItem('user_session', JSON.stringify(session))`
     - Phân quyền redirect:
       - `role_id === 1` → `/admin.html`
       - `role_id === 2` → `/index.html`

### Task 3.3 — Test Authentication
- [ ] **3.3.1** Test đăng ký tài khoản mới → kiểm tra Firebase Auth + Firestore
- [ ] **3.3.2** Test đăng nhập → kiểm tra `localStorage.user_session` có đúng format
- [ ] **3.3.3** Test auto-redirect khi đã đăng nhập
- [ ] **3.3.4** Test session hết hạn (thay đổi expiry thủ công trong DevTools)
- [ ] **3.3.5** Test phân quyền: login admin → admin.html, login user → index.html

**✅ Điều kiện hoàn thành Phase 3:**
- Đăng ký tạo account Firebase Auth + Firestore doc thành công
- Đăng nhập lưu session + redirect đúng theo role
- Session hết hạn → tự redirect về login

---

# ═══════════════════════════════════════════
# PHASE 4 — LANDING PAGE (Trang Chủ)
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 2 — Tạo Trang Landing
> **Mục tiêu**: Tạo trang chủ hoàn chỉnh với header, hero, xe nổi bật, footer

### Task 4.1 — index.html
- [x] **4.1.1** Head section:
  - Title, meta charset, viewport
  - Bootstrap 5.0.2 CSS (CDN)
  - Font Awesome 6.5.1 (CDN + local fallback)
  - Link: `main.css` + `guest.css`

- [x] **4.1.2** Booking Form Overlay (ẩn mặc định):
  ```html
  <div class="booking-form"></div>
  ```

- [x] **4.1.3** Fixed Header:
  - Logo đại lý (link về trang chủ)
  - Hamburger icon cho mobile (`.icon-dropdown`)
  - Nav (class `hidden` trên mobile):
    - Trang chủ, Showroom, Đặt cọc (🚗)
    - Profile dropdown (`#author-menu-drd`)

- [x] **4.1.4** Hero Banner Section:
  - `.banner-group` với background ảnh showroom + parallax
  - Slogan đại lý + CTA button → link tới `/showroom.html`
  - Badge khuyến mãi: "Ưu đãi lên đến 50 triệu"

- [x] **4.1.5** Intro Section:
  - YouTube iframe embed (video quảng cáo / review xe)
  - Đoạn text mô tả đại lý, kinh nghiệm, số xe bán ra

- [x] **4.1.6** Featured Cars:
  - Heading "Xe nổi bật tháng này"
  - Container `.car-list` → JS sẽ populate (max 3 items, mỗi hàng)
  - Mỗi card hiển thị: ảnh, brand + model, năm, type badge, giá

- [x] **4.1.7** Footer:
  - 3 cột: Về chúng tôi (địa chỉ đại lý) | Giờ mở cửa | Liên hệ (hotline + social)
  - Background image

- [x] **4.1.8** Script tags (đúng thứ tự):
  1. Firebase SDKs (3 file compat)
  2. `firebase-config.js`
  3. `local-db.js`
  4. `guest.js`
  5. `get-car.js`
  6. `check_session.js`

### Task 4.2 — guest.js (Profile Dropdown)
- [x] **4.2.1** Đọc `user_session` từ localStorage
- [x] **4.2.2** Nếu có session hợp lệ → render dropdown:
  - Hiển thị họ tên + email
  - Link: Đơn đặt cọc (`/booking.html`), Ví tiền (`/deposit.html`)
  - Nút Đăng xuất → confirm → xóa session → redirect
- [x] **4.2.3** Nếu chưa đăng nhập → hiện link "Đăng nhập"
- [x] **4.2.4** Hamburger menu toggle (mobile): click ☰ → toggle class `hidden` trên nav

### Task 4.3 — get-car.js (Hiển thị xe)
- [x] **4.3.1** Function `getCarList(container, limit?)`:
  - `LocalDB.get('cars')` → sort theo `createdAt` DESC
  - Nếu có `limit` → slice(0, limit) — index.html dùng limit=3
  - Render HTML card cho mỗi xe:
    ```html
    <div class="car-item col-md-4">
        <img src="..." style="height:220px; object-fit:cover;">
        <span class="badge">SUV</span>
        <h4>Toyota Camry 2024</h4>
        <p class="text-accent">Giá: 1.200.000.000 ₫</p>
        <p class="text-grey">Số tự động | Xăng | Còn 2 xe</p>
        <button class="btn-primary booking-btn" data-id="...">Đặt cọc ngay</button>
    </div>
    ```
- [x] **4.3.2** Function `formatPrice(price)`:
  ```javascript
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  ```
- [x] **4.3.3** Function `showBookingForm(carId)`:
  - Tìm xe trong LocalDB
  - Render modal overlay:
    - Ảnh xe, tên, năm, màu sắc (select), ghi chú
    - Số tiền cọc cố định: 50.000.000 VNĐ
    - Nút Xác nhận đặt cọc / Đóng
  - Hiện modal (`display: block`)
- [x] **4.3.4** Function `handleBooking(carId, color, note)`:
  - Kiểm tra session → nếu chưa đăng nhập → redirect login
  - Kiểm tra tồn kho: `car.stock > 0` → nếu hết → alert "Xe đã hết hàng"
  - Tạo booking object:
    ```javascript
    {
      author: email, carId, color, note,
      depositAmount: 50000000,
      status: 0, createdAt
    }
    ```
  - `LocalDB.add('orders', bookingData)`
  - `LocalDB.update('cars', carId, { stock: car.stock - 1 })`
  - Alert "Đặt cọc thành công! Vui lòng thanh toán tiền cọc." → đóng modal
- [x] **4.3.5** Gắn event click cho các nút "Đặt cọc ngay" → `checkSession()` → `showBookingForm()`

**✅ Điều kiện hoàn thành Phase 4:**
- Trang chủ hiển thị đầy đủ: header, hero parallax, video, 3 xe nổi bật, footer
- Profile dropdown hoạt động (đăng nhập/đăng xuất)
- Click "Đặt cọc ngay" → modal hiện → xác nhận → booking được lưu vào LocalDB
- Tồn kho xe giảm 1 sau khi đặt cọc thành công
- Responsive hoạt động trên mobile

---

# ═══════════════════════════════════════════
# PHASE 5 — SHOWROOM & XEM TẤT CẢ XE
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 5 — Showroom & Hiển Thị Xe
> **Mục tiêu**: Trang showroom hiển thị TẤT CẢ xe + bộ lọc nâng cao

### Task 5.1 — showroom.html
- [x] **5.1.1** Cấu trúc giống `index.html` nhưng:
  - KHÔNG có hero banner và video section
  - Heading: "Showroom xe ô tô"
  - Bộ lọc phía trên danh sách xe:
    - Select: Hãng xe (All, Toyota, Honda, Ford, Hyundai, Mazda...)
    - Select: Loại xe (All, Sedan, SUV, Pickup, Hatchback, MPV)
    - Select: Nhiên liệu (All, Xăng, Dầu, Hybrid, Điện)
    - Select: Sắp xếp giá (Mặc định, Giá tăng dần, Giá giảm dần)
  - `.car-list` → JS populate TẤT CẢ xe + có thể lọc
- [x] **5.1.2** Cùng header, footer, booking form overlay
- [x] **5.1.3** Script tags: giống index.html, thêm `showroom-filter.js` (nếu tách)
- [x] **5.1.4** Gọi `getCarList(container)` KHÔNG truyền limit
- [x] **5.1.5** Function `filterCars(brand, type, fuel, sort)`:
  - `LocalDB.get('cars')` → filter theo brand, type, fuelType
  - Nếu sort = "asc" → `sort((a,b) => a.price - b.price)`
  - Nếu sort = "desc" → `sort((a,b) => b.price - a.price)`
  - Render lại `.car-list`
- [x] **5.1.6** Gắn event `change` cho tất cả select lọc → gọi `filterCars()`

**✅ Điều kiện hoàn thành Phase 5:**
- showroom.html hiển thị toàn bộ xe từ LocalDB
- Bộ lọc theo hãng / loại / nhiên liệu hoạt động đúng
- Sắp xếp theo giá hoạt động
- Đặt cọc từ showroom hoạt động giống trang chủ

---

# ═══════════════════════════════════════════
# PHASE 6 — ĐƠN ĐẶT CỌC & THANH TOÁN
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 6 — Đặt Cọc & Lịch Sử Đơn Hàng
> **Mục tiêu**: Trang quản lý đơn đặt cọc cá nhân + thanh toán bằng ví

### Task 6.1 — booking.html
- [x] **6.1.1** Header + Footer (giống index/showroom)
- [x] **6.1.2** Section chính:
  - Heading "Đơn đặt cọc của tôi"
  - Container `.booking-list` → JS populate
- [x] **6.1.3** Script tags: bao gồm `booking.js`

### Task 6.2 — booking.js
- [x] **6.2.1** Function `getBookingList()`:
  - Đọc session → lấy email
  - `LocalDB.get('orders')` → filter theo `order.author === email`
  - `LocalDB.get('cars')` → join thông tin xe (brand, model, image)
  - Render mỗi đơn:
    - Ảnh xe, Brand + Model, Màu đã chọn, Ghi chú
    - Tiền cọc: 50.000.000 ₫
    - Ngày đặt (format `vi-VN` timezone `Asia/Ho_Chi_Minh`)
    - Trạng thái đơn
  - Status mapping:
    | Code | Text | Nút hiển thị |
    |------|------|-------------|
    | `0` | Chờ thanh toán cọc | [Thanh toán] [Hủy] |
    | `1` | Đã cọc - Chờ giao xe | — |
    | `2` | Đã nhận xe | — |
    | `3` | Đã hủy | [Xóa] |

- [x] **6.2.2** Tính `unpaidDeposit` — tổng tiền cọc các đơn status=0:
  - Nếu > 0 → hiện section thanh toán với tổng tiền + nút "Thanh toán cọc"

- [x] **6.2.3** Hủy đơn (status 0):
  - Click "Hủy" → confirm → `LocalDB.remove('orders', orderId)` → hoàn lại tồn kho xe: `stock + 1` → refresh list

- [x] **6.2.4** Xóa đơn đã hủy (status 3):
  - Click "Xóa" → `LocalDB.remove('orders', orderId)` → refresh list

- [x] **6.2.5** Thanh toán cọc:
  - Tìm user trong LocalDB
  - Kiểm tra `user.deposit >= unpaidDeposit` → nếu không đủ → alert lỗi "Số dư ví không đủ. Vui lòng nạp thêm."
  - Nếu đủ:
    1. `newDeposit = user.deposit - unpaidDeposit`
    2. `LocalDB.update('users', user.id, { deposit: newDeposit })`
    3. Sync Firestore: `db.collection("users").doc(user.id).update({ deposit: newDeposit })`
    4. Cập nhật tất cả đơn status=0 của user → status=1
    5. Alert "Thanh toán cọc thành công! Nhân viên sẽ liên hệ xác nhận." → refresh list

**✅ Điều kiện hoàn thành Phase 6:**
- Đơn đặt cọc hiển thị đúng theo user đang đăng nhập
- Hủy đơn: đơn bị xóa + tồn kho xe được hoàn lại
- Thanh toán cọc: trừ ví đúng, đơn chuyển sang status=1, Firestore sync
- Thiếu tiền → alert cảnh báo với link đến trang nạp ví

---

# ═══════════════════════════════════════════
# PHASE 7 — VÍ & NẠP TIỀN
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 7 — Ví & Nạp Tiền
> **Mục tiêu**: Trang nạp tiền vào ví + hiển thị số dư

### Task 7.1 — deposit.html
- [x] **7.1.1** Header + Footer (giống các trang user)
- [x] **7.1.2** Link "← Về Showroom" (`/showroom.html`)
- [x] **7.1.3** Heading "Nạp tiền vào ví"
- [x] **7.1.4** Layout 2 cột (Bootstrap `row`):
  - **Cột trái (col-md-6)**: Form nạp tiền
    - Input: Số tài khoản (`#account-number`)
    - Select: Ngân hàng (Vietcombank, Viettinbank, Techcombank, BIDV, MB Bank, VPBank)
    - Input: Số tiền (`#amount`, type=number, min=10000000, step=1000000)
    - Gợi ý nhanh: các nút 50tr / 100tr / 200tr / 500tr
    - Button "Nạp tiền"
  - **Cột phải (col-md-6)**: Thông tin ví
    - "Số dư hiện tại"
    - `.deposit-balance` → JS format VNĐ
    - Hướng dẫn: Tiền cọc tối thiểu mỗi xe là 50.000.000 ₫
- [x] **7.1.5** Script tags: bao gồm `deposit.js`

### Task 7.2 — deposit.js
- [x] **7.2.1** Function `loadDepositBalance()`:
  - Đọc session → tìm user trong LocalDB
  - Format deposit → hiện lên `.deposit-balance`
- [x] **7.2.2** Function `formatAmount(amount)`:
  - Dùng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- [x] **7.2.3** Quick-select buttons (50tr / 100tr...):
  - Click → tự điền vào input `#amount`
- [x] **7.2.4** Form submit handler:
  - `e.preventDefault()`
  - Validate số tiền `>= 10.000.000` → alert lỗi nếu không đủ
  - Đọc `amount` → parse int
  - `newDeposit = user.deposit + amount`
  - `LocalDB.update('users', user.id, { deposit: newDeposit })`
  - Sync Firestore: `db.collection("users").doc(user.id).update({ deposit: newDeposit })`
  - Cập nhật UI → alert "Nạp tiền thành công"
- [x] **7.2.5** Gọi `loadDepositBalance()` khi DOMContentLoaded

**✅ Điều kiện hoàn thành Phase 7:**
- Số dư hiển thị đúng (format VNĐ)
- Nút gợi ý nhanh điền đúng giá trị vào input
- Nạp tiền → balance tăng lên → Firestore sync
- Sau nạp tiền → quay lại booking.html → thanh toán cọc thành công

---

# ═══════════════════════════════════════════
# PHASE 8 — ADMIN: QUẢN LÝ XE
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 8 — Admin Quản Lý Danh Sách Xe
> **Mục tiêu**: Trang admin CRUD xe ô tô với sidebar layout

### Task 8.1 — admin.html
- [x] **8.1.1** Layout Sidebar (wireframe Layout C):
  ```html
  <div class="row">
      <!-- Sidebar (col-md-2) -->
      <div class="sidebar col-md-2">
          <img src="src/img/logo.png">
          <ul>
              <li><a href="/admin.html">🚗 Quản lý xe</a></li>
              <li><a href="/admin_order.html">📋 Đơn đặt cọc</a></li>
              <li><a href="/">🏷️ Hãng xe</a></li>
              <li><a href="/">👥 Tài khoản</a></li>
              <li><a href="/">⚙️ Cài đặt</a></li>
          </ul>
      </div>
      <!-- Content (col-md-10) -->
      <div class="content col-md-10">...</div>
  </div>
  ```
- [x] **8.1.2** Content area — 2 phần:
  - **Form thêm xe (col-md-4)**:
    - Hãng xe (input text)
    - Dòng xe / Model (input text)
    - Năm sản xuất (input number, min=2015, max=2026)
    - Giá bán (input number)
    - Loại xe (select: Sedan / SUV / Pickup / Hatchback / MPV)
    - Nhiên liệu (select: Xăng / Dầu / Hybrid / Điện)
    - Hộp số (select: Số tự động / Số sàn)
    - Số lượng tồn kho (input number)
    - URL ảnh xe (input text)
    - Nút Lưu + Đặt lại
  - **Bảng xe (col-md-8)**:
    - Table thead: #, Hình, Hãng + Model, Năm, Giá, Loại, Tồn kho, Thao tác
    - Tbody `#car-list`
- [x] **8.1.3** Script tags: Firebase SDKs → `firebase-config.js` → `local-db.js` → `admin.js`

### Task 8.2 — admin.js
- [x] **8.2.1** Role-Based Access Control (chạy khi DOMContentLoaded):
  - Đọc session → nếu không có → redirect `/login.html`
  - Query Firestore: `db.collection('users').where('email', '==', email).get()`
  - Nếu `role_id !== 1` → redirect `/index.html`
  - Nếu là admin → gọi `loadCars()`

- [x] **8.2.2** Function `loadCars()`:
  - `LocalDB.get('cars')` → render table rows:
    ```html
    <tr>
        <td>STT</td>
        <td><img src="..." style="width:80px; height:60px; object-fit:cover;"></td>
        <td>Toyota Camry</td>
        <td>2024</td>
        <td>1.200.000.000 ₫</td>
        <td><span class="badge">SUV</span></td>
        <td>2</td>
        <td>
          <button class="btn-primary edit-btn" data-id="...">✏️ Sửa</button>
          <button class="btn-danger delete-btn" data-id="...">🗑️ Xóa</button>
        </td>
    </tr>
    ```
  - Gắn event click cho các nút Xóa và Sửa

- [x] **8.2.3** Add Car (form submit):
  - Đọc tất cả fields từ form
  - Validate: brand, model, price, stock không được rỗng
  - `LocalDB.add('cars', { brand, model, year, price, type, fuelType, transmission, stock, image, createdAt })`
  - `loadCars()` → reset form

- [x] **8.2.4** Edit Car (inline):
  - Click "Sửa" → điền dữ liệu xe vào form
  - Đổi nút "Lưu" thành "Cập nhật" + lưu `editingId`
  - Submit → `LocalDB.update('cars', editingId, updatedData)` → reset form + `loadCars()`

- [x] **8.2.5** Delete Car:
  - `confirm('Bạn có chắc muốn xóa xe này?')`
  - Kiểm tra không có đơn đặt cọc status=0 hoặc 1 liên quan → alert cảnh báo
  - `LocalDB.remove('cars', carId)`
  - `loadCars()`

**✅ Điều kiện hoàn thành Phase 8:**
- Chỉ admin (role_id=1) mới vào được admin.html
- User thường bị redirect về index.html
- Thêm xe → bảng refresh → xe mới xuất hiện trên showroom
- Sửa xe → thông tin cập nhật đúng
- Xóa xe → xe biến mất khỏi showroom

---

# ═══════════════════════════════════════════
# PHASE 9 — ADMIN: QUẢN LÝ ĐƠN ĐẶT CỌC
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 9 — Admin Quản Lý Đơn Đặt Cọc
> **Mục tiêu**: Admin xem TẤT CẢ đơn đặt cọc + thay đổi trạng thái + thống kê

### Task 9.1 — admin_order.html
- [x] **9.1.1** Cùng sidebar layout như admin.html
- [x] **9.1.2** Content:
  - **Dashboard cards** (4 ô thống kê):
    - Tổng đơn hôm nay
    - Đang chờ thanh toán
    - Đã cọc / Chờ giao xe
    - Doanh thu cọc tháng này
  - Heading "Danh sách đơn đặt cọc"
  - Bộ lọc: Select trạng thái (All / Chờ / Đã cọc / Đã nhận / Đã hủy)
  - Table thead: #, Khách hàng, Xe, Màu, Tiền cọc, Ngày đặt, Trạng thái, Thao tác
  - Tbody `#order-list-admin`
- [x] **9.1.3** Script tags: bao gồm `admin_order.js`

### Task 9.2 — admin_order.js
- [x] **9.2.1** Role check (giống admin.js)
- [x] **9.2.2** Function `loadStats()`:
  - Đếm tổng đơn hôm nay (so sánh ngày `createdAt`)
  - Đếm đơn status=0 (chờ thanh toán)
  - Đếm đơn status=1 (đã cọc)
  - Tính tổng depositAmount của đơn status=1 trong tháng hiện tại
  - Render lên 4 dashboard cards
- [x] **9.2.3** Function `loadOrders(filterStatus?)`:
  - `LocalDB.get('orders')` → lấy TẤT CẢ đơn
  - Nếu `filterStatus !== 'all'` → filter theo status
  - Join thông tin xe từ `LocalDB.get('cars')` (brand, model)
  - Join thông tin user email từ session (chỉ có email, không cần join sâu)
  - Render mỗi row với dropdown select trạng thái:
    ```html
    <select class="status-select" data-order-id="...">
        <option value="0">Chờ thanh toán cọc</option>
        <option value="1">Đã cọc - Chờ giao xe</option>
        <option value="2">Đã nhận xe</option>
        <option value="3">Đã hủy</option>
    </select>
    ```
  - Set `selected` attribute theo status hiện tại
- [x] **9.2.4** Event handler — thay đổi dropdown:
  - `select.addEventListener('change', ...)`:
  - Đọc `orderId` + `newStatus`
  - `LocalDB.update('orders', orderId, { status: parseInt(newStatus) })`
  - Nếu newStatus = 3 (hủy) → hoàn lại tồn kho xe: `stock + 1`
  - `loadStats()` để cập nhật dashboard
- [x] **9.2.5** Select lọc trạng thái → gọi lại `loadOrders(selectedStatus)`

**✅ Điều kiện hoàn thành Phase 9:**
- Admin thấy TẤT CẢ đơn từ mọi user
- Dashboard stats hiển thị đúng số liệu
- Thay đổi dropdown → status được cập nhật trong LocalDB
- Admin hủy đơn → tồn kho xe được hoàn lại
- User vào booking.html → thấy status mới do admin đổi

---

# ═══════════════════════════════════════════
# PHASE 10 — HOÀN THIỆN & TRIỂN KHAI
# ═══════════════════════════════════════════
> **Tham chiếu Guide**: Bước 10 — Tối Ưu & Triển Khai
> **Mục tiêu**: Kiểm tra tổng thể, sửa bug, deploy

### Task 10.1 — End-to-End Testing
- [x] **10.1.1** Test flow Đăng ký → Đăng nhập:
  - Đăng ký user mới → kiểm tra Firebase Auth + Firestore
  - Đăng nhập → kiểm tra session + redirect đúng role
- [x] **10.1.2** Test flow Showroom & Bộ lọc:
  - Lọc theo hãng / loại / nhiên liệu → kết quả đúng
  - Sắp xếp giá tăng / giảm → đúng thứ tự
- [x] **10.1.3** Test flow Đặt cọc:
  - Xem showroom → đặt cọc → kiểm tra LocalDB orders + tồn kho xe giảm
  - Hủy đơn → kiểm tra tồn kho xe tăng trở lại
- [x] **10.1.4** Test flow Thanh toán cọc:
  - Nạp tiền → kiểm tra deposit (LocalDB + Firestore)
  - Đặt cọc → thanh toán → deposit giảm → đơn status chuyển sang 1
  - Thanh toán khi thiếu tiền → alert lỗi
- [x] **10.1.5** Test flow Admin:
  - Login admin → admin.html
  - Thêm xe → showroom.html thấy xe mới
  - Sửa xe → thông tin đúng
  - Xóa xe → xe biến mất
  - admin_order.html → xem thống kê + đổi status → user thấy thay đổi
  - Admin hủy đơn → tồn kho hoàn lại
- [x] **10.1.6** Test Session:
  - Session hết hạn → auto redirect login
  - Đăng xuất → session bị xóa
- [x] **10.1.7** Test Responsive:
  - Mobile (≤ 575.98px): hamburger menu, layout stack, bộ lọc gọn
  - Desktop: layout đầy đủ, bảng admin hiển thị đẹp

### Task 10.2 — Sửa Bug & Polish
- [x] **10.2.1** Kiểm tra console không có lỗi JS
- [x] **10.2.2** Kiểm tra không có duplicate IDs trong HTML
- [x] **10.2.3** Kiểm tra tất cả link navigation hoạt động
- [x] **10.2.4** Kiểm tra CSS paths đúng (main.css, auth.css, guest.css)
- [x] **10.2.5** Kiểm tra Firebase SDK chỉ load 1 lần (không trùng)
- [x] **10.2.6** Kiểm tra tồn kho không bị âm (stock < 0)

### Task 10.3 — Deploy
- [x] **10.3.1** Chọn platform: GitHub Pages / Netlify / Vercel / Firebase Hosting
- [x] **10.3.2** Push code lên repository
- [x] **10.3.3** Config deploy settings
- [x] **10.3.4** Verify website live hoạt động đúng

**✅ Điều kiện hoàn thành Phase 10:**
- Tất cả flow hoạt động end-to-end không lỗi
- Responsive OK trên mobile + desktop
- Tồn kho xe cập nhật chính xác qua tất cả các thao tác
- Website đã deploy và truy cập được online

---

# ═══════════════════════════════════════════
# 📊 BẢNG TỔNG HỢP FILES & DEPENDENCIES
# ═══════════════════════════════════════════

> [!TIP]
> Bảng này giúp AI biết file nào phụ thuộc file nào — quan trọng cho thứ tự include script tags.

| File | Tạo ở Phase | Dependencies (cần load trước) |
|------|-------------|-------------------------------|
| `main.css` | 1 | — |
| `guest.css` | 1 | main.css |
| `auth.css` | 1 | main.css |
| `firebase-config.js` | 2 | Firebase SDK (CDN) |
| `local-db.js` | 2 | — |
| `check_session.js` | 2 | — |
| `register.js` | 3 | firebase-config.js |
| `login.js` | 3 | firebase-config.js, local-db.js |
| `guest.js` | 4 | — |
| `get-car.js` | 4 | local-db.js, check_session.js |
| `booking.js` | 6 | local-db.js, firebase-config.js |
| `deposit.js` | 7 | local-db.js, firebase-config.js |
| `admin.js` | 8 | local-db.js, firebase-config.js |
| `admin_order.js` | 9 | local-db.js, firebase-config.js |

---

# ═══════════════════════════════════════════
# 📋 MASTER PROGRESS TRACKER
# ═══════════════════════════════════════════

| Phase | Mô tả | Số tasks | Trạng thái |
|-------|--------|----------|------------|
| 0 | Khởi tạo dự án | 3 | `[x]` |
| 1 | Design System & CSS | 13 | `[x]` |
| 2 | Firebase & LocalDB | 8 | `[x]` |
| 3 | Authentication | 8 | `[x]` |
| 4 | Landing Page | 15 | `[x]` |
| 5 | Showroom & Bộ lọc | 6 | `[x]` |
| 6 | Đơn đặt cọc & Thanh toán | 7 | `[x]` |
| 7 | Ví & Nạp tiền | 7 | `[x]` |
| 8 | Admin Quản lý xe | 7 | `[x]` |
| 9 | Admin Quản lý đơn | 6 | `[x]` |
| 10 | Testing & Deploy | 16 | `[x]` |
| **TỔNG** | | **96 tasks** | |

---

> 📝 **Tài liệu được tạo từ JSI_CarShop_Project_Guide.md**  
> 📅 **Ngày tạo**: 10/06/2026  
> 🎯 **Mục đích**: AI đọc file này → thực hiện từng Phase → tạo ra dự án web bán ô tô hoàn chỉnh
