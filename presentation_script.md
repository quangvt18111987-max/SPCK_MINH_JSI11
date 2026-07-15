# Kịch bản / Nội dung thuyết trình Dự án SPCK Minh (CarShop)

> **Mục đích của tài liệu này**: Cung cấp đầy đủ thông tin, cấu trúc và điểm nhấn của dự án để AI (hoặc con người) có thể dựa vào đây thiết kế các slide thuyết trình (PowerPoint / Canva / Google Slides).

---

## 🛑 SLIDE 1: Tiêu đề & Giới thiệu
- **Tiêu đề dự án**: CarShop - Nền tảng Showroom & Đặt lịch Ô tô trực tuyến
- **Người thực hiện**: Minh (Dự án SPCK - Sản Phẩm Cuối Khóa)
- **Slogan**: "Trải nghiệm mua xe mượt mà, từ trực tuyến đến đời thực"
- **Nội dung chính**: Giới thiệu ngắn gọn đây là một ứng dụng web quản lý showroom ô tô, hỗ trợ khách hàng xem xe, đặt cọc và thanh toán qua ví điện tử, đồng thời cung cấp hệ thống quản trị (Admin) toàn diện.

## 🛑 SLIDE 2: Vấn đề & Giải pháp
- **Vấn đề**: 
  - Khách hàng mất nhiều thời gian đến trực tiếp showroom chỉ để xem mẫu xe.
  - Quy trình đặt cọc thủ công, rườm rà.
  - Quản lý kho xe và đơn đặt cọc của đại lý dễ sai sót.
- **Giải pháp (CarShop)**:
  - Số hóa toàn bộ showroom lên web với giao diện trực quan, bộ lọc thông minh.
  - Tích hợp ví điện tử và quy trình đặt cọc tự động hóa.
  - Cung cấp Dashboard quản lý tập trung cho Admin.

## 🛑 SLIDE 3: Kiến trúc kỹ thuật & Công nghệ sử dụng
- **Frontend (Giao diện)**:
  - HTML5, CSS3 (Custom Design System với CSS Variables)
  - JavaScript (ES6)
  - Bootstrap 5 & Font Awesome
- **Backend & Cơ sở dữ liệu (Mô hình Hybrid)**:
  - **Firebase Authentication**: Quản lý đăng ký/đăng nhập, bảo mật người dùng.
  - **Firebase Firestore**: Đồng bộ hóa dữ liệu quan trọng (ví tiền người dùng) trên Cloud.
  - **LocalDB (Custom Wrapper)**: Quản lý database nội bộ qua `localStorage` (lưu trữ xe, đơn cọc) giúp ứng dụng chạy cực nhanh và phản hồi tức thì.

## 🛑 SLIDE 4: Phân quyền & Đối tượng người dùng
Hệ thống được thiết kế với **Role-Based Access Control (RBAC)** chia làm 3 nhóm:
1. **Khách vãng lai (Guest)**: Xem trang chủ, xem showroom, đăng ký/đăng nhập.
2. **Khách hàng (User - `role_id: 2`)**: 
   - Lọc & tìm kiếm xe nâng cao.
   - Đặt cọc xe & Quản lý lịch sử đơn hàng.
   - Nạp tiền vào ví điện tử.
3. **Quản trị viên (Admin - `role_id: 1`)**: 
   - Truy cập trang Dashboard nội bộ.
   - Quản lý kho xe (Thêm, Sửa, Xóa).
   - Quản lý đơn đặt cọc (Cập nhật trạng thái) & Xem thống kê doanh thu.

## 🛑 SLIDE 5: Tính năng nổi bật - Phía Khách Hàng (User)
- **Giao diện Premium**: Thiết kế Glassmorphism, hiệu ứng Parallax, Responsive hoàn hảo trên mobile.
- **Bộ lọc Showroom thông minh**: Lọc tức thì theo Hãng, Kiểu dáng (SUV/Sedan...), Nhiên liệu, và Sắp xếp giá.
- **Ví điện tử (Wallet) & Thanh toán**: 
  - Nạp tiền mô phỏng qua chuyển khoản ngân hàng.
  - Tự động trừ tiền khi xác nhận thanh toán cọc.
- **Quản lý đơn cọc**: Theo dõi trạng thái đơn (Chờ thanh toán -> Đã cọc -> Đã nhận xe -> Đã hủy). Hệ thống tự động hoàn lại số lượng tồn kho xe khi hủy đơn.

## 🛑 SLIDE 6: Tính năng nổi bật - Phía Quản Trị (Admin)
- **Bảng điều khiển Thống kê (Dashboard)**: Thống kê realtime số đơn trong ngày, đơn chờ xử lý, đơn hoàn thành và tổng doanh thu cọc trong tháng.
- **Quản lý Kho Xe (CRUD)**: Giao diện trực quan để cập nhật thông tin xe, giá bán, số lượng tồn kho. Có cảnh báo không cho xóa xe nếu đang có đơn cọc liên quan.
- **Xử lý Đơn hàng (Order Management)**: Dễ dàng chuyển đổi trạng thái đơn hàng. Hệ thống tự động đồng bộ (giảm/tăng tồn kho xe) tương ứng với hành động của Admin.

## 🛑 SLIDE 7: Điểm nhấn Kỹ thuật (Dành cho Slide đánh giá code)
- **Thiết kế Component-based bằng JS thuần**: Các hàm render UI được module hóa (ví dụ: `getCarList`, `loadBookingData`).
- **Session Management**: Quản lý phiên đăng nhập an toàn, tự động đá ra ngoài (`auto-redirect`) khi hết hạn session hoặc cố tình truy cập trái phép trang Admin.
- **Xử lý Bất đồng bộ (Async/Await)**: Tích hợp mượt mà giữa thao tác Local và đồng bộ Firebase Cloud.

## 🛑 SLIDE 8: Timeline 
- *Timeline (Thời gian hoàn thành)*: 
  - Buổi 1. Thiết kế giao diện và quy trình người dùng.
  - Buổi 2. Xây dựng hệ thống quản trị Admin.
  - Buổi 3. Tích hợp ví điện tử và thanh toán cọc.
  - Buổi 4. Hoàn thiện Database và UI.

## 🛑 SLIDE 9: Hướng phát triển tương lai
- Tích hợp cổng thanh toán thật (VNPay, Momo).
- Thêm chức năng Review & Đánh giá xe.
- Xây dựng hệ thống chat hỗ trợ trực tuyến giữa Khách hàng và Nhân viên Sale.

## 🛑 SLIDE 10: Lời cảm ơn & Q&A
- Cảm ơn thầy cô/khán giả đã lắng nghe.
- Chuyển sang phần hỏi đáp (Q&A).
