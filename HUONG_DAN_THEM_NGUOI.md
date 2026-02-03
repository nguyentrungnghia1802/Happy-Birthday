# 📝 Hướng Dẫn Thêm Người Mới

## 🎯 Quy Trình Thêm Người Nhận Sinh Nhật

### Bước 1: Chuẩn Bị Ảnh

1. Tạo folder mới trong `res/img/` với tên folder (ví dụ: `nguyen-van-a`)
2. Đặt tên ảnh theo format: `1.jpg`, `2.jpg`, `3.jpg`, ...
   - ⚠️ **Quan trọng**: Ảnh phải bắt đầu từ số `1` và liên tục không có số bị thiếu
   - Hỗ trợ các định dạng: `.jpg`, `.png`, `.jpeg`, `.webp`, `.gif`

**Ví dụ cấu trúc folder:**
```
res/img/nguyen-van-a/
├── 1.jpg
├── 2.jpg
├── 3.jpg
├── 4.jpg
└── 5.jpg
```

### Bước 2: Cập Nhật Config

Mở file `config.js` và thêm người mới vào `PERSON_CONFIGS`:

```javascript
nguyenvana: {
  name: "Nguyễn Văn A",           // Tên hiển thị
  folder: "nguyen-van-a",         // Tên folder chứa ảnh (không có res/img/)
  extension: "jpg",               // Đuôi file ảnh
  photoCount: 5,                  // Số lượng ảnh (từ 1.jpg đến 5.jpg)
  customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
  themeColor: "#ffd700",          // Màu chủ đạo (hex color)
}
```

### Bước 3: Truy Cập Link

Sau khi thêm config, truy cập link:
```
https://your-domain.com/?person=nguyenvana
```

Hoặc sử dụng trang admin để generate link tự động:
```
https://your-domain.com/admin.html
```

---

## 🎨 Tùy Chỉnh Nâng Cao

### Thay Đổi Màu Theme

Chọn màu phù hợp với tính cách người nhận:
- 🟡 `#ffd700` - Vàng (mặc định)
- 🔴 `#ff6b6b` - Đỏ (năng động)
- 🔵 `#4ecdc4` - Xanh dương (tươi mát)
- 🟣 `#a29bfe` - Tím (lãng mạn)
- 🟢 `#00d2d3` - Xanh lá (tự nhiên)
- 🟠 `#fd79a8` - Hồng (ngọt ngào)

### Tùy Chỉnh Lời Chúc

Thay đổi `customMessage` để cá nhân hóa:
```javascript
customMessage: "Chúc {name} tuổi mới vạn sự như ý, luôn vui vẻ và hạnh phúc!"
// {name} sẽ được thay thế bằng tên thực
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Tên file ảnh**: Phải là số liên tục từ 1 đến photoCount
   - ✅ Đúng: `1.jpg, 2.jpg, 3.jpg`
   - ❌ Sai: `tai_1.jpg, tai_2.jpg` (không còn cần prefix nữa)
   - ❌ Sai: `1.jpg, 3.jpg, 4.jpg` (thiếu 2.jpg)

2. **Extension**: Tất cả ảnh phải cùng định dạng
   - ✅ Đúng: Tất cả `.jpg` hoặc tất cả `.png`
   - ❌ Sai: Vừa `.jpg` vừa `.png` trong cùng folder

3. **Photo Count**: Phải khớp với số ảnh thực tế
   - Nếu có 5 ảnh thì `photoCount: 5`
   - Nếu không có ảnh thì `photoCount: 0`

---

## 📖 Ví Dụ Đầy Đủ

### Thêm "Trần Thị B" với 7 ảnh PNG

**1. Tạo folder và thêm ảnh:**
```
res/img/tran-thi-b/
├── 1.png
├── 2.png
├── 3.png
├── 4.png
├── 5.png
├── 6.png
└── 7.png
```

**2. Thêm vào config.js:**
```javascript
tranthib: {
  name: "Trần Thị B",
  folder: "tran-thi-b",
  extension: "png",
  photoCount: 7,
  customMessage: "Chúc {name} sinh nhật thật ý nghĩa và đáng nhớ! 🎉",
  themeColor: "#ff6b6b",
}
```

**3. Truy cập:**
```
https://your-domain.com/?person=tranthib
```

---

## 🚀 Mẹo Tối Ưu

1. **Tối ưu kích thước ảnh**: Nên resize ảnh về kích thước hợp lý (1920x1080 hoặc nhỏ hơn) để website load nhanh
2. **Số lượng ảnh**: Nên có từ 5-10 ảnh để trải nghiệm tốt nhất
3. **Chất lượng ảnh**: Chọn những ảnh đẹp, có ý nghĩa để tạo cảm xúc

---

## 🆘 Xử Lý Lỗi

### Ảnh không hiển thị?
- Kiểm tra tên file có đúng format `1.jpg`, `2.jpg` không
- Kiểm tra `extension` trong config có khớp với file thực tế
- Kiểm tra `photoCount` có đúng số lượng ảnh

### Link không hoạt động?
- Kiểm tra tên folder có dấu cách hoặc ký tự đặc biệt
- Nên dùng: `nguyen-van-a` thay vì `Nguyen Van A`
- Key trong config phải viết liền không dấu: `nguyenvana`

### Màu theme không đổi?
- Đảm bảo `themeColor` là mã hex hợp lệ: `#rrggbb`
- Ví dụ: `#ff6b6b` chứ không phải `red` hoặc `#f00`

---

**💡 Tip**: Sử dụng trang `admin.html` để xem danh sách tất cả người đã thêm và copy link nhanh!
