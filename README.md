<div align="center">
  <img src="spck_minh_cover.png" alt="SPCK Minh Project" style="width: 300px; height: 300px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
  
  <h1>Dự án SPCK Minh</h1>
  <p><strong>Website Showroom và Đặt lịch Ô tô</strong></p>
</div>

## Giới thiệu
Đây là dự án SPCK (Sản Phẩm Cuối Khóa) của Minh. Dự án cung cấp nền tảng quản lý showroom ô tô, xem chi tiết sản phẩm và hỗ trợ người dùng đặt lịch hẹn nhanh chóng, tiện lợi.

## Chức năng chính

Dự án được phân chia thành các vai trò với những tính năng chuyên biệt, mang lại trải nghiệm đầy đủ cho cả khách hàng và quản trị viên:

### 1. Dành cho Khách hàng (User)
- **Hệ thống Tài khoản**: Đăng nhập, đăng ký an toàn sử dụng Firebase Authentication. Có quản lý session tự động.
- **Khám phá Showroom**: 
  - Xem danh sách xe ô tô nổi bật và toàn bộ kho xe.
  - **Bộ lọc nâng cao**: Lọc tức thì theo Hãng xe, Kiểu dáng (SUV, Sedan...), Loại nhiên liệu và Sắp xếp theo Giá bán.
- **Ví Điện Tử (Wallet) & Thanh toán**:
  - Nạp tiền vào ví qua giao diện mô phỏng chuyển khoản ngân hàng.
  - Dữ liệu ví được đồng bộ bảo mật qua Firebase Cloud Firestore.
- **Đặt cọc & Quản lý Đơn hàng**:
  - Đặt cọc xe trực tuyến, hệ thống tự động kiểm tra trạng thái tồn kho.
  - Thanh toán tiền cọc an toàn bằng số dư ví điện tử.
  - Quản lý lịch sử đơn đặt cọc, hỗ trợ hủy đơn (khi chưa thanh toán) và tự động hoàn lại số lượng tồn kho.

### 2. Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard)**: Thống kê trực quan số lượng đơn trong ngày, đơn chờ xử lý, đơn đã hoàn thành và tổng doanh thu tiền cọc.
- **Quản lý Kho Xe (CRUD)**: Thêm mới, chỉnh sửa thông tin (giá, số lượng, hình ảnh) và xóa xe. Hệ thống chặn xóa với các xe đang có đơn đặt cọc chưa hoàn thành để tránh lỗi dữ liệu.
- **Quản lý Đơn hàng**: Xem toàn bộ đơn đặt cọc của hệ thống, thay đổi trạng thái đơn hàng (Chờ thanh toán ➔ Đã cọc ➔ Đã nhận xe) và tự động cập nhật thống kê.

### 3. Công nghệ nổi bật
- **Phân quyền (RBAC)**: Kiểm soát truy cập chặt chẽ, tự động chuyển hướng nếu phát hiện truy cập trái phép.
- **Mô hình Hybrid Database**: Kết hợp linh hoạt giữa Firebase (Auth, Firestore) và LocalStorage (qua Custom Wrapper `LocalDB`) giúp tăng tối đa tốc độ phản hồi trang web.
- **UI/UX Hiện đại**: Responsive toàn diện trên thiết bị di động, sử dụng Bootstrap 5, CSS Variables và các hiệu ứng Glassmorphism, Parallax đẹp mắt.
