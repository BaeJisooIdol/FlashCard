# FlashCard Learning App

Ứng dụng học tập thông qua flashcard tương tác, được xây dựng bằng React và Bootstrap.

## Tính năng chính

- **Quản lý Flashcard**

  - Tạo, xem, cập nhật và xóa flashcard
  - Hỗ trợ gán nhiều danh mục cho mỗi flashcard
  - Tìm kiếm và lọc flashcard theo danh mục

- **Quản lý Deck**

  - Tổ chức flashcard thành các deck
  - Tạo deck mới với nhiều danh mục
  - Thêm flashcard từ nhiều danh mục vào deck
  - Chỉnh sửa thông tin và danh mục của deck

- **Chế độ học tập**

  - Chế độ Study: lật flashcard để học
  - Chế độ Quiz: kiểm tra kiến thức với câu hỏi trắc nghiệm
  - Tự động bắt đầu quiz khi chọn deck
  - Hiển thị kết quả và thống kê sau khi hoàn thành quiz

- **Chia sẻ và cộng tác**

  - Chia sẻ deck với người dùng khác
  - Deck công khai và riêng tư
  - Bình luận và đánh giá deck công khai

- **Bảng điều khiển**

  - Thống kê học tập và tiến độ
  - Biểu đồ phân phối flashcard theo danh mục
  - Xem lịch sử kết quả quiz
  - Thử lại các bài quiz trước đó

- **Giao diện người dùng**
  - Thiết kế đáp ứng đầy đủ
  - Chuyển đổi chế độ sáng/tối
  - Thông báo toast cho các hành động
  - Giao diện thân thiện với người dùng

## Công nghệ sử dụng

- React 18
- React Router v6+
- React Bootstrap
- React Icons
- Context API cho quản lý state
- Axios cho API calls
- JSON Server cho backend

## Bắt đầu

### Yêu cầu

- Node.js (>= 14.x)
- npm (>= 6.x)

### Cài đặt

1. Clone repository hoặc tải mã nguồn
2. Di chuyển đến thư mục dự án

```bash
cd flashcard-app
```

3. Cài đặt các dependencies

```bash
npm install
```

### Chạy ứng dụng

1. Khởi động JSON Server (trong một terminal)

```bash
npm run server
```

Điều này sẽ khởi động backend JSON server tại http://localhost:5000

2. Khởi động máy chủ phát triển React (trong terminal khác)

```bash
npm start
```

Điều này sẽ chạy ứng dụng ở chế độ phát triển tại http://localhost:3000

## Sử dụng

- **Trang chủ**: Tổng quan về ứng dụng và tính năng
- **Flashcards**: Xem, tìm kiếm và quản lý tất cả flashcard của bạn
- **Deck chia sẻ**: Khám phá và sử dụng deck công khai hoặc được chia sẻ với bạn
- **Deck của tôi**: Quản lý các deck bạn đã tạo
- **Tạo Flashcard**: Thêm flashcard mới vào bộ sưu tập của bạn
- **Chế độ Study**: Lật qua các flashcard để học
- **Chế độ Quiz**: Kiểm tra kiến thức của bạn với câu hỏi trắc nghiệm
- **Bảng điều khiển**: Theo dõi tiến độ và xem thống kê của bạn

## Cấu trúc dự án

```
flashcard-app/
  ├── public/              # Tài nguyên tĩnh
  ├── src/
  │   ├── assets/          # Hình ảnh và tài nguyên
  │   ├── components/      # Các component React
  │   │   ├── common/      # Component dùng chung
  │   │   ├── dashboard/   # Component cho bảng điều khiển
  │   │   ├── flashcards/  # Component cho flashcard
  │   │   ├── layout/      # Component layout
  │   │   ├── quiz/        # Component cho chế độ quiz
  │   │   └── study/       # Component cho chế độ study
  │   ├── context/         # Context API
  │   ├── pages/           # Các trang của ứng dụng
  │   ├── routes/          # Cấu hình định tuyến
  │   ├── services/        # API và dịch vụ
  │   ├── styles/          # CSS và style
  │   └── utils/           # Tiện ích và helper
  ├── db.json              # Database JSON Server
  └── package.json         # Dependencies và script
```

## Giấy phép

MIT

## Ghi nhận

- React Bootstrap cho các component UI
- JSON Server cho mock backend
- React Icons cho bộ icon đẹp
