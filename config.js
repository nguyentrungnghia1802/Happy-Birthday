// ===== PERSONALIZATION CONFIG =====

// Cấu hình cho từng người nhận
// Format mới: chỉ cần folder, extension và số lượng ảnh
const PERSON_CONFIGS = {
  default: {
    name: "Name",
    folder: "empty",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  anhtai: {
    name: "Anh Tài",
    folder: "anh-tai",
    extension: "jpg",
    photoCount: 8,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  thuytien: {
    name: "Thuỷ Tiên",
    folder: "thuy-tien",
    extension: "jpg",
    photoCount: 8,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  lanhuong: {
    name: "Lan Hương",
    folder: "lan-huong",
    extension: "png",
    photoCount: 2,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  bichhang: {
    name: "Bích Hằng",
    folder: "bich-hang",
    extension: "png",  // File 1-4 là .png, file 5-7 là .jpg (mixed)
    photoCount: 7,
    extensionMap: {1:'png',2:'png',3:'png',4:'png',5:'jpg',6:'jpg',7:'jpg'}, // Map cho mixed extensions
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  phuongphuong: {
    name: "Phương Phương",
    folder: "phuong-phuong",
    extension: "jpg",
    photoCount: 5,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  minhanh: {
    name: "Minh Anh",
    folder: "minh-anh",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  anhtusempai: {
    name: "Sempai Anh Tú",
    folder: "anh-tu-sempai",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",  
  },
  truclinh: {
    name: "Trúc Linh",
    folder: "truc-linh",
    extension: "jpg",
    photoCount: 8,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  chitrang: {
    name: "Chị Trang",
    folder: "chi-trang",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  van: {
    name: "Vân",
    folder: "van",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  phuongthao: {
    name: "Phương Thảo",
    folder: "phuong-thao",
    extension: "jpg",
    photoCount: 0,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  thuyduong: {
    name: "Thuỳ Dương",
    folder: "thuy-duong",
    extension: "jpg",  // File 1-2 là .jpg, file 3-6 là .png (mixed)
    photoCount: 6,
    extensionMap: {1:'jpg',2:'jpg',3:'png',4:'png',5:'png',6:'png'}, // Map cho mixed extensions
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  thanhhuyen: {
    name: "Thanh Huyền",
    folder: "thanh-huyen",
    extension: "png",
    photoCount: 14,
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  }
};

// Danh sách tiêu đề và mô tả mẫu cho từng ảnh
const PHOTO_TITLES = [
  {
    title: "🎂 Sinh Nhật Vui Vẻ",
    description: "Những khoảnh khắc hạnh phúc bên bánh kem",
  },
  {
    title: "🎈 Tiệc Sinh Nhật",
    description: "Bóng bay và niềm vui không ngừng",
  },
  {
    title: "🎁 Món Quà Đặc Biệt",
    description: "Những món quà đầy ý nghĩa",
  },
  {
    title: "🕯️ Ước Mơ Thành Thật",
    description: "Thổi nến và ước những điều tốt đẹp",
  },
  {
    title: "🏡 Khoảnh Khắc Bên Gia Đình",
    description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
  },
  {
    title: "👫 Bạn Bè Vui Vẻ",
    description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
  },
  {
    title: "🍰 Bánh Kem Ngọt Ngào",
    description: "Khoảnh khắc thổi nến và cắt bánh kem tuyệt vời.",
  },
  {
    title: "✨ Ước Mơ Tuổi Mới",
    description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
  },
];

// Hàm tự động generate danh sách ảnh từ folder và extension
// Hỗ trợ cả mixed extensions thông qua extensionMap
function generatePhotoSet(folder, extension, photoCount, extensionMap) {
  const photos = [];
  
  for (let i = 1; i <= photoCount; i++) {
    const titleData = PHOTO_TITLES[(i - 1) % PHOTO_TITLES.length];
    
    // Nếu có extensionMap, dùng extension cụ thể cho từng file
    // Nếu không, dùng extension chung
    const fileExtension = extensionMap && extensionMap[i] ? extensionMap[i] : extension;
    
    photos.push({
      src: `res/img/${folder}/${i}.${fileExtension}`,
      title: titleData.title,
      description: titleData.description,
    });
  }
  return photos;
}

// Hàm lấy config dựa trên URL parameters
function getPersonConfig() {
  const urlParams = new URLSearchParams(window.location.search);
  const personKey = urlParams.get("person") || "default";

  const config = PERSON_CONFIGS[personKey] || PERSON_CONFIGS["default"];
  const photos = generatePhotoSet(config.folder, config.extension, config.photoCount, config.extensionMap);

  return {
    ...config,
    photos: photos,
  };
}

// Hàm tạo URL cho từng người
function generatePersonalURL(personKey) {
  const baseURL = window.location.origin + window.location.pathname;
  return `${baseURL}?person=${personKey}`;
}

// Export để sử dụng trong script.js
window.PersonalizationConfig = {
  getPersonConfig,
  generatePersonalURL,
  PERSON_CONFIGS,
};
