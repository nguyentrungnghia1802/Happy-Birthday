// ===== PERSONALIZATION CONFIG =====

// Cấu hình cho từng người nhận
const PERSON_CONFIGS = {
  default: {
    name: "Name",
    photoSet: "empty",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  anhtai: {
    name: "Anh Tài",
    photoSet: "anhtai",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  thuytien: {
    name: "Thuỷ Tiên",
    photoSet: "thuytien",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  lanhuong: {
    name: "Lan Hương",
    photoSet: "lanhuong",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  bichhang: {
    name: "Bích Hằng",
    photoSet: "bichhang",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
  phuongphuong: {
    name: "Phương Phương",
    photoSet: "phuongphuong",
    customMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    themeColor: "#ffd700",
  },
};

// Bộ ảnh cho từng người
const PHOTO_SETS = {
  anhtai: [
    {
      src: "res/img/anh-tai/tai_1.jpg",
      title: "🎂 Sinh Nhật Vui Vẻ",
      description: "Những khoảnh khắc hạnh phúc bên bánh kem",
    },
    {
      src: "res/img/anh-tai/tai_2.jpg",
      title: "🎈 Tiệc Sinh Nhật",
      description: "Bóng bay và niềm vui không ngừng",
    },
    {
      src: "res/img/anh-tai/tai_3.jpg",
      title: "🎁 Món Quà Đặc Biệt",
      description: "Những món quà đầy ý nghĩa",
    },
    {
      src: "res/img/anh-tai/tai_4.jpg",
      title: "🕯️ Ước Mơ Thành Thật",
      description: "Thổi nến và ước những điều tốt đẹp",
    },
    {
      src: "res/img/anh-tai/tai_5.jpg",
      title: "🏡 Khoảnh Khắc Bên Gia Đình",
      description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
    },
    {
      src: "res/img/anh-tai/tai_6.jpg",
      title: "👫 Bạn Bè Vui Vẻ",
      description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
    },
    {
      src: "res/img/anh-tai/tai_7.jpg",
      title: "🍰 Bánh Kem Ngọt Ngào",
      description: "Khoảnh khắc thổi nến và cắt bánh kem tuyệt vời.",
    },
    {
      src: "res/img/anh-tai/tai_8.jpg",
      title: "✨ Ước Mơ Tuổi Mới",
      description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
    },
  ],
  thuytien: [
    {
      src: "res/img/thuy-tien/tien-1.jpg",
      title: "🎂 Sinh Nhật Vui Vẻ",
      description: "Những khoảnh khắc hạnh phúc bên bánh kem",
    },
    {
      src: "res/img/thuy-tien/tien-2.jpg",
      title: "🎈 Tiệc Sinh Nhật",
      description: "Bóng bay và niềm vui không ngừng",
    },
    {
      src: "res/img/thuy-tien/tien-3.jpg",
      title: "🎁 Món Quà Đặc Biệt",
      description: "Những món quà đầy ý nghĩa",
    },
    {
      src: "res/img/thuy-tien/tien-4.jpg",
      title: "🕯️ Ước Mơ Thành Thật",
      description: "Thổi nến và ước những điều tốt đẹp",
    },
    {
      src: "res/img/thuy-tien/tien-5.jpg",
      title: "🏡 Khoảnh Khắc Bên Gia Đình",
      description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
    },
    {
      src: "res/img/thuy-tien/tien-6.jpg",
      title: "👫 Bạn Bè Vui Vẻ",
      description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
    },
    {
      src: "res/img/thuy-tien/tien-7.jpg",
      title: "🍰 Bánh Kem Ngọt Ngào",
      description: "Khoảnh khắc thổi nến và cắt bánh kem tuyệt vời.",
    },
    {
      src: "res/img/thuy-tien/tien-8.jpg",
      title: "✨ Ước Mơ Tuổi Mới",
      description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
    },
  ],

  lanhuong: [
    {
      src: "res/img/lan-huong/huong-1.png",
      title: "🎂 Sinh Nhật Vui Vẻ",
      description: "Những khoảnh khắc hạnh phúc bên bánh kem",
    },
    {
      src: "res/img/lan-huong/huong-2.png",
      title: "🎈 Tiệc Sinh Nhật",
      description: "Bóng bay và niềm vui không ngừng",
    },
    {
      src: "res/img/lan-huong/huong-1.png",
      title: "🎁 Món Quà Đặc Biệt",
      description: "Những món quà đầy ý nghĩa",
    },
    {
      src: "res/img/lan-huong/huong-2.png",
      title: "🕯️ Ước Mơ Thành Thật",
      description: "Thổi nến và ước những điều tốt đẹp",
    },
    {
      src: "res/img/lan-huong/huong-1.png",
      title: "🏡 Khoảnh Khắc Bên Gia Đình",
      description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
    },
    {
      src: "res/img/lan-huong/huong-2.png",
      title: "👫 Bạn Bè Vui Vẻ",
      description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
    },
    {
      src: "res/img/lan-huong/huong-1.png",
      title: "🍰 Bánh Kem Ngọt Ngào",
      description: "Khoảnh khắc thổi nến và cắt bánh kem tuyệt vời.",
    },
    {
      src: "res/img/lan-huong/huong-2.png",
      title: "✨ Ước Mơ Tuổi Mới",
      description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
    },
  ],
  bichhang: [
    {
      src: "res/img/bich-hang/hang-1.png",
      title: "🎂 Sinh Nhật Vui Vẻ",
      description: "Những khoảnh khắc hạnh phúc bên bánh kem",
    },
    {
      src: "res/img/bich-hang/hang-2.png",
      title: "🎈 Tiệc Sinh Nhật",
      description: "Bóng bay và niềm vui không ngừng",
    },
    {
      src: "res/img/bich-hang/hang-3.png",
      title: "🎁 Món Quà Đặc Biệt",
      description: "Những món quà đầy ý nghĩa",
    },
    {
      src: "res/img/bich-hang/hang-4.png",
      title: "🕯️ Ước Mơ Thành Thật",
      description: "Thổi nến và ước những điều tốt đẹp",
    },
    {
      src: "res/img/bich-hang/hang-5.jpg",
      title: "🏡 Khoảnh Khắc Bên Gia Đình",
      description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
    },
    {
      src: "res/img/bich-hang/hang-6.jpg",
      title: "👫 Bạn Bè Vui Vẻ",
      description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
    },
    {
      src: "res/img/bich-hang/hang-7.jpg",
      title: "✨ Ước Mơ Tuổi Mới",
      description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
    },
  ],

  phuongphuong: [
    {
      src: "res/img/phuong-phuong/phuong-1.jpg",
      title: "🎂 Sinh Nhật Vui Vẻ",
      description: "Những khoảnh khắc hạnh phúc bên bánh kem",
    },
    {
      src: "res/img/phuong-phuong/phuong-2.jpg",
      title: "🎈 Tiệc Sinh Nhật",
      description: "Bóng bay và niềm vui không ngừng",
    },
    {
      src: "res/img/phuong-phuong/phuong-3.jpg",
      title: "🎁 Món Quà Đặc Biệt",
      description: "Những món quà đầy ý nghĩa",
    },
    {
      src: "res/img/phuong-phuong/phuong-4.jpg",
      title: "🕯️ Ước Mơ Thành Thật",
      description: "Thổi nến và ước những điều tốt đẹp",
    },
    {
      src: "res/img/phuong-phuong/phuong-5.jpg",
      title: "🏡 Khoảnh Khắc Bên Gia Đình",
      description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
    },
  ],
};

// Hàm lấy config dựa trên URL parameters
function getPersonConfig() {
  const urlParams = new URLSearchParams(window.location.search);
  const personKey = urlParams.get("person") || "default";

  const config = PERSON_CONFIGS[personKey] || PERSON_CONFIGS["default"];
  const photos = PHOTO_SETS[config.photoSet] || [];

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
