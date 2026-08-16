// ===== CONFIGURATION & LOCALIZATION (I18N) =====

// Ngôn ngữ hỗ trợ & Ngôn ngữ mặc định
const SUPPORTED_LANGUAGES = ['ja', 'vi'];
const DEFAULT_LANGUAGE = 'ja'; // Mặc định là tiếng Nhật

// Từ điển đa ngôn ngữ (i18n) - Ngữ điệu tiếng Nhật lịch sự, tôn trọng, thân thiện (dành cho cấp trên, đồng nghiệp, bạn bè)
const TRANSLATIONS = {
  ja: {
    pageTitle: "🎉 お誕生日おめでとうございます！ 🎂",
    mainTitleLine1: "🎉 お誕生日",
    mainTitleLine2: "おめでとうございます",
    mainTitleLine3: "🎂",
    defaultName: "先輩",
    defaultCustomMessage: "{name}さん、心よりお誕生日をお祝い申し上げます！",
    blowButton: "🌬️ ろうそくを吹き消す",
    blowingButton: "🌬️ 吹き消しています...",
    blowInstruction: "ろうそくをタップするか、上のボタンを押して吹き消してくださいね！",
    wishesTitle: "💝 お祝いメッセージ",
    wishes: [
      "🌟 いつも温かいご指導とサポートをありがとうございます！健康で幸せな日々をお過ごしください。",
      "🎈 この新しい一年が、さらなる飛躍と実り多き素晴らしい年になりますようお祈り申し上げます！",
      "🌺 いつも笑顔と活力をいただき心より感謝しております。幸多き最高の一年になりますように！",
      "🎁 これまでのご活躍に敬意を表すとともに、今後のますますのご健勝とご多幸をお祈りいたします。",
      "✨ 充実した笑顔あふれる素晴らしい一年となりますよう、心よりお祈り申し上げます！"
    ],
    musicPlay: "音楽 ON",
    musicPause: "音楽 OFF",
    surpriseButton: "🎊 特別なサプライズ 🎁",
    explosionTitle: "🎊 大切な思い出 🎊",
    explosionInstruction: "👆 写真をタップすると思い出をご覧いただけます",
    galleryDefaultTitle: "誕生日の素敵な思い出",
    galleryDefaultDesc: "心に残る大切なひととき",
    welcomeMessage: "🎂 お誕生日おめでとうございます！特別な一日をお楽しみください 🎂",
    alreadyBlownMessage: "🕯️ ろうそくは吹き消されました！素敵な時間をお過ごしください 🎉",
    allBlownMessage: "🎉 おめでとうございます！すべての願いが叶い、幸多き一年になりますように 🎉",
    specialWish: "✨ すべてのろうそくが吹き消されました！素晴らしい夢がたくさん叶いますように ✨",
    lightsOnMessage: "💡 明かりがつきました！心よりお誕生日をお祝い申し上げます 🎂",
    mobileInstruction: "📱画面をタップして、素敵な願いを込めてくださいね！",
    surpriseMessages: [
      "🎊 お誕生日おめでとうございます！いつも本当にありがとうございます 🎊",
      "🎁 日頃の感謝の気持ちを込めて、特別なプレゼントをお届けします 🎁",
      "🌟 いつも温かく見守ってくださり感謝しています。素敵な一日をお過ごしください 🌟",
      "🎈 今日という特別な日が、最高の笑顔で満たされますように 🎈",
      "💝 ますますのご健康とご多幸を心よりお祈り申し上げます 💝"
    ]
  },
  vi: {
    pageTitle: "🎉 Chúc Mừng Sinh Nhật! 🎂",
    mainTitleLine1: "🎉 Chúc Mừng",
    mainTitleLine2: "Sinh Nhật",
    mainTitleLine3: "🎂",
    defaultName: "Bạn",
    defaultCustomMessage: "Chúc {name} một ngày sinh nhật thật tuyệt vời!",
    blowButton: "🌬️ Thổi Nến",
    blowingButton: "🌬️ Đang Thổi...",
    blowInstruction: "Nhấp vào từng ngọn nến hoặc nút bên trên để thổi tắt!",
    wishesTitle: "💝 Lời Chúc Sinh Nhật",
    wishes: [
      "🌟 Chúc bạn luôn khỏe mạnh và hạnh phúc!",
      "🎈 Mong tất cả ước mơ của bạn đều thành hiện thực!",
      "🌺 Chúc năm tuổi mới đầy niềm vui và thành công!",
      "🎁 Sinh nhật vui vẻ và nhiều điều tuyệt vời nhé!",
      "✨ Chúc bạn ngày càng tươi vui và rực rỡ!"
    ],
    musicPlay: "Bật Nhạc",
    musicPause: "Tắt Nhạc",
    surpriseButton: "🎊 Bất Ngờ Đặc Biệt",
    explosionTitle: "🎊 Kỷ Niệm Đặc Biệt 🎊",
    explosionInstruction: "👆 Chạm vào ảnh để xem từng kỷ niệm",
    galleryDefaultTitle: "Kỷ Niệm Sinh Nhật",
    galleryDefaultDesc: "Những khoảnh khắc đáng nhớ",
    welcomeMessage: "🎂 Chào mừng đến với bữa tiệc sinh nhật! 🎂",
    alreadyBlownMessage: "🕯️ Nến đã được thổi rồi! Hãy tận hưởng khoảnh khắc này! 🎉",
    allBlownMessage: "🎉 Chúc mừng! Tất cả ước mơ sẽ thành hiện thực! 🎉",
    specialWish: "✨ Chúc mừng bạn đã thổi tắt tất cả nến! Mọi ước mơ đều sẽ thành hiện thực! ✨",
    lightsOnMessage: "💡 Đèn đã được bật lại! Chúc mừng sinh nhật! 🎂",
    mobileInstruction: "📱Chạm Thổi nến để thổi bùng lên điều ước của bạn!",
    surpriseMessages: [
      "🎊 Bất ngờ! Chúc bạn sinh nhật vui vẻ! 🎊",
      "🎁 Món quà đặc biệt dành cho bạn! 🎁",
      "🌟 Bạn thật tuyệt vời! Chúc mừng sinh nhật! 🌟",
      "🎈 Hy vọng ngày hôm nay thật đặc biệt với bạn! 🎈",
      "💝 Gửi bạn những lời chúc tốt đẹp nhất! 💝"
    ]
  }
};

// Cấu hình cho từng người nhận
const PERSON_CONFIGS = {
  default: {
    name: "Name",
    folder: "empty",
    extension: "jpg",
    photoCount: 0,
    customMessage: {
      ja: "{name}さん、心よりお誕生日をお祝い申し上げます！",
      vi: "Chúc {name} một ngày sinh nhật thật tuyệt vời!"
    },
    themeColor: "#ffd700",
    showSurprise: true,
  },
  anhtai: {
    name: "Anh Tài",
    folder: "anh-tai",
    extension: "jpg",
    photoCount: 8,
    customMessage: {
      ja: "{name}さん、心よりお誕生日をお祝い申し上げます！",
      vi: "Chúc {name} một ngày sinh nhật thật tuyệt vời!"
    },
    themeColor: "#ffd700",
  },
  phuongthao: {
    name: "Chị Phương Thảo",
    folder: "phuong-thao",
    extension: "jpg",
    photoCount: 0,
    customMessage: {
      ja: "{name}さん、心よりお誕生日をお祝い申し上げます！",
      vi: "Chúc {name} một ngày sinh nhật thật tuyệt vời!"
    },
    themeColor: "#ffd700",
    showSurprise: false,
  },
  minhtrang: {
    name: "Minh Trang",
    folder: "minh-trang",
    extension: "png",
    photoCount: 10,
    customMessage: {
      ja: "{name}さん、心よりお誕生日をお祝い申し上げます！",
      vi: "Chúc {name} một ngày sinh nhật thật tuyệt vời!"
    },
    themeColor: "#ffd700",
  },
  moriyama: {
    name: "森山さん",
    folder: "moriyama",
    extension: "jpg",
    photoCount: 0,
    customMessage: {
      ja: "{name}、心よりお誕生日をお祝い申し上げます！いつも温かいご指導とサポートをありがとうございます。",
      vi: "Kính chúc {name} một ngày sinh nhật thật tuyệt vời, nhiều sức khỏe và hạnh phúc!"
    },
    themeColor: "#ffd700",
    showSurprise: false,
  },
};

// Danh sách tiêu đề và mô tả mẫu cho từng ảnh (Đa ngôn ngữ)
const PHOTO_TITLES = {
  ja: [
    { title: "🎂 幸せなひととき", description: "笑顔あふれる温かい誕生日のお祝い" },
    { title: "🎈 華やかなパーティー", description: "感謝とお祝いの気持ちを込めて" },
    { title: "🎁 心を込めた贈り物", description: "日頃の感謝と祝福を込めたプレゼント" },
    { title: "🕯️ 願いを込めて", description: "これからの輝かしい未来への願い" },
    { title: "🏡 大切な仲間とともに", description: "絆を感じる温かいひととき" },
    { title: "👫 笑顔あふれる時間", description: "共に過ごすかけがえのない思い出" },
    { title: "🍰 祝福のケーキ", description: "幸せと実りに満ちた特別な瞬間" },
    { title: "✨ 輝かしい新たな一年へ", description: "ますますのご活躍とご健康をお祈りして" },
  ],
  vi: [
    { title: "🎂 Sinh Nhật Vui Vẻ", description: "Khoảnh khắc hạnh phúc bên bánh kem" },
    { title: "🎈 Tiệc Sinh Nhật", description: "Niềm vui bên bóng bay" },
    { title: "🎁 Món Quà Đặc Biệt", description: "Quà tặng đầy ý nghĩa" },
    { title: "🕯️ Ước Mơ Thành Thật", description: "Thổi nến và ước điều tốt đẹp" },
    { title: "🏡 Bên Gia Đình", description: "Quây quần trong ngày đặc biệt" },
    { title: "👫 Bạn Bè Vui Vẻ", description: "Tiếng cười bên bạn thân" },
    { title: "🍰 Bánh Kem Ngọt Ngào", description: "Khoảnh khắc thổi nến cắt bánh" },
    { title: "✨ Ước Mơ Tuổi Mới", description: "Lời chúc cho năm tuổi mới" },
  ]
};

// ===== CÁC HÀM HELPER VỀ NGÔN NGỮ =====

function getCurrentLanguage() {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang.toLowerCase())) {
      return urlLang.toLowerCase();
    }
  }
  if (typeof localStorage !== 'undefined') {
    const storedLang = localStorage.getItem('preferred_language');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      return storedLang;
    }
  }
  return DEFAULT_LANGUAGE; // Mặc định là 'ja'
}

function setCurrentLanguage(lang) {
  if (SUPPORTED_LANGUAGES.includes(lang) && typeof localStorage !== 'undefined') {
    localStorage.setItem('preferred_language', lang);
  }
}

function t(key, lang) {
  const currentLang = lang || getCurrentLanguage();
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANGUAGE];
  return dict[key] !== undefined ? dict[key] : (TRANSLATIONS[DEFAULT_LANGUAGE][key] || key);
}

function getPhotoTitles(lang) {
  const currentLang = lang || getCurrentLanguage();
  return PHOTO_TITLES[currentLang] || PHOTO_TITLES[DEFAULT_LANGUAGE];
}

// Hàm tự động generate danh sách ảnh từ folder và extension
function generatePhotoSet(folder, extension, photoCount, extensionMap, lang) {
  const photos = [];
  const titles = getPhotoTitles(lang);

  for (let i = 1; i <= photoCount; i++) {
    const titleData = titles[(i - 1) % titles.length];
    const fileExtension = extensionMap && extensionMap[i] ? extensionMap[i] : extension;

    photos.push({
      src: `res/img/${folder}/${i}.${fileExtension}`,
      title: titleData.title,
      description: titleData.description,
    });
  }
  return photos;
}

// Hàm lấy config dựa trên URL parameters & language
function getPersonConfig(lang) {
  const currentLang = lang || getCurrentLanguage();
  let personKey = "default";

  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    personKey = urlParams.get("person") || "default";
  }

  const rawConfig = PERSON_CONFIGS[personKey] || PERSON_CONFIGS["default"];
  const isDefaultPerson = personKey === "default" || rawConfig.name === "Name";

  // Tên hiển thị
  const name = isDefaultPerson ? t('defaultName', currentLang) : rawConfig.name;

  // Lời chúc tùy chỉnh
  let customMessage = rawConfig.customMessage;
  if (typeof customMessage === 'object' && customMessage !== null) {
    customMessage = customMessage[currentLang] || customMessage[DEFAULT_LANGUAGE];
  } else if (!customMessage || isDefaultPerson) {
    customMessage = t('defaultCustomMessage', currentLang);
  }

  const photos = generatePhotoSet(rawConfig.folder, rawConfig.extension, rawConfig.photoCount, rawConfig.extensionMap, currentLang);

  return {
    ...rawConfig,
    name: name,
    customMessage: customMessage,
    photos: photos,
    currentLang: currentLang,
  };
}

// Hàm tạo URL cho từng người kèm theo ngôn ngữ
function generatePersonalURL(personKey, lang) {
  const baseURL = (typeof window !== 'undefined' && window.location)
    ? window.location.origin + window.location.pathname
    : '';
  const currentLang = lang || getCurrentLanguage();
  const params = new URLSearchParams();

  if (personKey && personKey !== 'default') {
    params.set('person', personKey);
  }
  if (currentLang !== DEFAULT_LANGUAGE) {
    params.set('lang', currentLang);
  }

  const query = params.toString();
  return query ? `${baseURL}?${query}` : baseURL;
}

// Export để sử dụng trong script.js & admin.html
window.PersonalizationConfig = {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  TRANSLATIONS,
  PHOTO_TITLES,
  PERSON_CONFIGS,
  getCurrentLanguage,
  setCurrentLanguage,
  t,
  getPhotoTitles,
  generatePhotoSet,
  getPersonConfig,
  generatePersonalURL,
};
