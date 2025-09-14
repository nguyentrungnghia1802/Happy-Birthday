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
};

// Bộ ảnh cho từng người
const PHOTO_SETS = {
    'anhtai': [
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
        }
    ],
    'thuytien': [
        {
            src: "res/img/thuy-tien/thuytien_1.jpg",
            title: "🎂 Sinh Nhật Vui Vẻ",
            description: "Những khoảnh khắc hạnh phúc bên bánh kem",
        },
        {
            src: "res/img/thuy-tien/thuytien_2.jpg",
            title: "🎈 Tiệc Sinh Nhật",
            description: "Bóng bay và niềm vui không ngừng",
        },
        {
            src: "res/img/thuy-tien/thuytien_3.jpg",
            title: "🎁 Món Quà Đặc Biệt",
            description: "Những món quà đầy ý nghĩa",
        },
        {
            src: "res/img/thuy-tien/thuytien_4.jpg",
            title: "🕯️ Ước Mơ Thành Thật",
            description: "Thổi nến và ước những điều tốt đẹp",
        },
        {
            src: "res/img/thuy-tien/thuytien_5.jpg",
            title: "🏡 Khoảnh Khắc Bên Gia Đình",
            description: "Cùng gia đình quây quần bên nhau trong ngày đặc biệt.",
        },
        {
            src: "res/img/thuy-tien/thuytien_6.jpg",
            title: "👫 Bạn Bè Vui Vẻ",
            description: "Những tiếng cười và niềm vui bên bạn bè thân thiết.",
        },
        {
            src: "res/img/thuy-tien/thuytien_7.jpg",
            title: "🍰 Bánh Kem Ngọt Ngào",
            description: "Khoảnh khắc thổi nến và cắt bánh kem tuyệt vời.",
        },
        {
            src: "res/img/thuy-tien/thuytien_8.jpg",
            title: "✨ Ước Mơ Tuổi Mới",
            description: "Những lời chúc và ước mơ cho năm tuổi mới thật rực rỡ.",
        }
    ],
};

// Hàm lấy config dựa trên URL parameters
function getPersonConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    const personKey = urlParams.get('person') || 'default';
    
    const config = PERSON_CONFIGS[personKey] || PERSON_CONFIGS['default'];
    const photos = PHOTO_SETS[config.photoSet] || PHOTO_SETS['tai'];
    
    return {
        ...config,
        photos: photos
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
    PERSON_CONFIGS
};