# SamLego Shop - Fullstack E-commerce Application

Chào mừng bạn đến với **SamLego**, một ứng dụng thương mại điện tử chuyên biệt cho các bộ sưu tập Lego với giao diện hiện đại, dễ thương theo phong cách **Soft Pastel / Claymorphism**. Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà trên cả máy tính và điện thoại di động.

## 🎨 Giao diện & Phong cách
- **Chủ đề:** Peachy/Warm Pastel (#FF9A86, #FFB399, #FFD6A6, #FFF0BE).
- **Thiết kế:** Claymorphism (Dạng đất nặn) với bo góc lớn, đổ bóng mềm mại, tạo cảm giác bồng bềnh và thân thiện.
- **Mobile-First:** Tối ưu hóa hoàn toàn cho thiết bị di động, hạn chế cuộn trang, menu điều hướng thông minh.

## 🚀 Tính năng chính
- **Dành cho Khách hàng:**
  - Xem sản phẩm theo danh mục hoặc tìm kiếm theo tên.
  - Chi tiết sản phẩm với bộ sưu tập nhiều ảnh (Gallery).
  - Giỏ hàng và quy trình thanh toán nhanh gọn.
  - Hỗ trợ thanh toán qua Chuyển khoản QR (tự động hiển thị thông tin ngân hàng của Shop).
  - Chỉnh sửa hồ sơ cá nhân và ảnh đại diện (Avatar).
  - Nút liên hệ trực tiếp với Shop qua Messenger.
- **Dành cho Quản trị viên (Admin):**
  - Quản lý sản phẩm, danh mục và đơn hàng tập trung.
  - Thống kê doanh thu theo ngày (7 ngày gần nhất) với biểu đồ trực quan.
  - Thiết lập thông tin ngân hàng và mã QR nhận tiền ngay trong hồ sơ.
  - **Nhập sản phẩm hàng loạt bằng Excel.**

## 📊 Hướng dẫn nhập sản phẩm hàng loạt (Excel)
Admin có thể tiết kiệm thời gian bằng cách chuẩn bị file Excel (.xlsx) để tải lên hàng trăm sản phẩm cùng lúc.

### Cấu trúc file Excel bắt buộc:
File Excel cần có các cột theo đúng thứ tự sau (không cần dòng tiêu đề):
1. **Tên sản phẩm:** Tên hiển thị của bộ Lego.
2. **Mã sản phẩm:** Mã định danh duy nhất (ví dụ: LEGO-42115).
3. **Mô tả:** Thông tin chi tiết về bộ sản phẩm.
4. **Giá:** Số tiền (ví dụ: 500000).
5. **Số lượng kho:** Số lượng đang có sẵn.
6. **URL hình ảnh:** Link ảnh sản phẩm. Để thêm nhiều ảnh, hãy phân cách các link bằng dấu phẩy `,`.
7. **ID Danh mục:** ID của danh mục tương ứng (xem trong tab Danh mục của Admin).

*Lưu ý: Đảm bảo file đúng định dạng .xlsx trước khi tải lên trong tab Sản phẩm -> Nhập Excel.*

## 🛠 Công nghệ sử dụng
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Java Spring Boot, Spring Security, JWT, JPA.
- **Database:** PostgreSQL.
- **DevOps:** Docker, Docker Compose.

## ⚙️ Cài đặt & Chạy ứng dụng

### 1. Chạy cục bộ bằng Docker
Yêu cầu: Đã cài đặt Docker và Docker Compose.
```bash
docker-compose up -d --build
```
- Frontend: `http://localhost`
- Backend: `http://localhost:8080`
- Tài khoản Admin mặc định: `minhthu2009` / `admin1104`

### 2. Deploy lên Railway (Khuyên dùng)
1. Push code lên GitHub.
2. Tại Railway, tạo Project mới từ GitHub Repo này.
3. Railway sẽ tự động nhận diện `docker-compose.yml`.
4. Cấu hình biến môi trường:
   - `VITE_API_URL`: Link domain backend của bạn (kèm `/api`).
   - Các biến Database (`SPRING_DATASOURCE_URL`, ...) sẽ được Railway tự động kết nối.

## 📝 Thông tin bản quyền
Phát triển bởi SamLego Team. Chúc bạn có những giây phút mua sắm vui vẻ!
