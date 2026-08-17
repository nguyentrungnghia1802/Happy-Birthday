// Hiệu ứng click vào mục tác giả chuyển hướng tới trang profile
document.addEventListener('DOMContentLoaded', function () {
    var authorCredit = document.getElementById('authorCredit');
    if (authorCredit) {
        authorCredit.addEventListener('click', function () {
            window.open('https://nguyentrungnghia1802.github.io/Profile/', '_blank');
        });
    }
});

// ===== GLOBAL VARIABLES =====
let currentLang = 'ja'; // Mặc định là tiếng Nhật
let candlesBlownOut = 0;
let musicPlaying = true; // Default to true (music on)
let wishIndex = 0;
let wishRotationInterval = null;
const totalCandles = 5;
let currentMelodyTimeout = null;
let candlesHaveBeenBlown = false; // Track if candles have been blown once

// Personalization variables - sẽ được khởi tạo từ URL parameters & config
let birthdayName = "お友達";
let personalConfig = {};
let photoData = [];

// Gallery variables
let currentPhotoIndex = 0;
let galleryAutoSlideTimeout = null;

// 3D Carousel variables
let carouselStage, carouselRing;
let carouselCurrentRotation = 0;
let carouselTargetRotation = 0;
let carouselAutoSpinSpeed = 0.25;
let carouselIsDragging = false;
let carouselDragStartX = 0;
let carouselDragStartRotation = 0;
let carouselDragMoved = false;
let carouselAnimationFrame = null;
let carouselIsHovered = false;
let carouselListenersAdded = false;

// ===== DOM ELEMENTS (Will be initialized after DOM loads) =====
let blowButton, surpriseButton, musicToggle, musicIcon, musicText;
let confettiContainer, fireworksContainer, lightingOverlay;
let photoGallery, galleryImage, photoTitle, photoDescription;
let prevPhotoBtn, nextPhotoBtn, closeGalleryBtn, currentPhotoNum, totalPhotosSpan, progressFill;
let explosionGallery, closeExplosion;
let birthdaySong, blowSound;
let langToggleBtn, currentLangFlag;
let mainTitleLine1, mainTitleLine2, mainTitleLine3, subtitleMessage, blowText, blowInstruction;
let wishesTitle, wishesContainer, explosionTitle, explosionInstruction;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo personalization và ngôn ngữ trước tiên
    if (typeof window.PersonalizationConfig !== 'undefined') {
        currentLang = window.PersonalizationConfig.getCurrentLanguage();
    }

    initializeDOM();
    initializePersonalization(currentLang);
    applyLanguage(currentLang, false);

    // Ẩn/hiện món quà đặc biệt dựa trên config
    if (personalConfig.showSurprise === false) {
        const surpriseSection = document.querySelector('.surprise-section');
        if (surpriseSection) {
            surpriseSection.style.display = 'none';
        }
    }

    initializeEventListeners();
    createBackgroundAnimations();
    playIntroAnimation();
});

// ===== PERSONALIZATION INITIALIZATION =====
function initializePersonalization(lang) {
    const targetLang = lang || currentLang;
    if (typeof window.PersonalizationConfig !== 'undefined') {
        personalConfig = window.PersonalizationConfig.getPersonConfig(targetLang);
        birthdayName = personalConfig.name;
        photoData = personalConfig.photos;

        // Áp dụng theme color nếu có
        if (personalConfig.themeColor) {
            applyThemeColor(personalConfig.themeColor);
        }
    } else {
        console.warn('PersonalizationConfig not found, using default values');
        photoData = [
            {
                src: "res/img/empty/1.jpg",
                title: "🎂 ハッピーバースデー",
                description: "ケーキを囲んで幸せなひととき",
            }
        ];
    }
}

function updateSubtitleMessage() {
    const subtitleElement = document.getElementById('subtitleMessage') || document.querySelector('.subtitle');
    if (subtitleElement && personalConfig.customMessage) {
        const messageText = personalConfig.customMessage.replace('{name}', `<span id="birthdayName" class="highlight-name">${birthdayName}</span>`);
        subtitleElement.innerHTML = messageText;
    }
}

function applyThemeColor(color) {
    if (!color) return;
    const cleanColor = color.trim();
    const root = document.documentElement;
    root.style.setProperty('--theme-color', cleanColor);

    const oldStyle = document.getElementById('dynamic-theme-style');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'dynamic-theme-style';
    style.textContent = `
        .highlight-name {
            color: ${cleanColor} !important;
            -webkit-text-fill-color: ${cleanColor} !important;
            background: none !important;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7) !important;
            filter: none !important;
        }
        .carousel-card:hover {
            border-color: ${cleanColor} !important;
            box-shadow: 0 20px 45px ${cleanColor}88 !important;
        }
        .explosion-title {
            border-color: ${cleanColor} !important;
        }
        .explosion-close:hover {
            border-color: ${cleanColor} !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== DOM INITIALIZATION =====
function initializeDOM() {
    // Main elements
    blowButton = document.getElementById('blowButton');
    surpriseButton = document.getElementById('surpriseButton');
    musicToggle = document.getElementById('musicToggle');
    musicIcon = document.getElementById('musicIcon');
    musicText = document.getElementById('musicText');
    confettiContainer = document.getElementById('confetti-container');
    fireworksContainer = document.getElementById('fireworks-container');
    lightingOverlay = document.getElementById('lightingOverlay');

    // Language switcher toggle button
    langToggleBtn = document.getElementById('langToggleBtn');
    currentLangFlag = document.getElementById('currentLangFlag');

    // Localizable text elements
    mainTitleLine1 = document.getElementById('mainTitleLine1');
    mainTitleLine2 = document.getElementById('mainTitleLine2');
    mainTitleLine3 = document.getElementById('mainTitleLine3');
    subtitleMessage = document.getElementById('subtitleMessage');
    blowText = document.getElementById('blowText');
    blowInstruction = document.getElementById('blowInstruction');
    wishesTitle = document.getElementById('wishesTitle');
    wishesContainer = document.getElementById('wishesContainer');
    explosionTitle = document.getElementById('explosionTitle');
    explosionInstruction = document.getElementById('explosionInstruction');

    // Gallery elements
    photoGallery = document.getElementById('photoGallery');
    galleryImage = document.getElementById('galleryImage');
    photoTitle = document.getElementById('photoTitle');
    photoDescription = document.getElementById('photoDescription');
    prevPhotoBtn = document.getElementById('prevPhoto');
    nextPhotoBtn = document.getElementById('nextPhoto');
    closeGalleryBtn = document.getElementById('closeGallery');
    currentPhotoNum = document.getElementById('currentPhotoNum');
    totalPhotosSpan = document.getElementById('totalPhotos');
    progressFill = document.querySelector('.progress-fill');

    // 3D Carousel elements
    explosionGallery = document.getElementById('explosionGallery');
    carouselStage = document.getElementById('carouselStage');
    carouselRing = document.getElementById('carouselRing');
    closeExplosion = document.getElementById('closeExplosion');

    // Audio elements
    birthdaySong = document.getElementById('birthdaySong');
    blowSound = document.getElementById('blowSound');
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    if (blowButton) blowButton.addEventListener('click', blowCandles);
    if (surpriseButton) surpriseButton.addEventListener('click', triggerSurprise);
    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

    // Language Switcher Toggle Event (Switch between JA & VI)
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Add click handlers for individual candles
    document.querySelectorAll('.candle').forEach((candle, index) => {
        candle.addEventListener('click', () => blowSingleCandle(index));
    });

    // Gallery event listeners
    if (prevPhotoBtn) prevPhotoBtn.addEventListener('click', previousPhoto);
    if (nextPhotoBtn) nextPhotoBtn.addEventListener('click', nextPhoto);
    if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closePhotoGallery);

    // Close gallery when clicking outside
    if (photoGallery) {
        photoGallery.addEventListener('click', (e) => {
            if (e.target === photoGallery) {
                closePhotoGallery();
            }
        });
    }

    // Explosion gallery event listeners
    if (closeExplosion) closeExplosion.addEventListener('click', closeExplosionGallery);

    // Add keyboard support
    document.addEventListener('keydown', handleKeyPress);

    // Initialize gallery
    initializeGallery();

    // Initialize music button state
    updateMusicButtonState();
}

// ===== LANGUAGE SWITCHING SYSTEM =====
function toggleLanguage() {
    const newLang = currentLang === 'ja' ? 'vi' : 'ja';
    switchLanguage(newLang);
}

function switchLanguage(lang) {
    if (lang === currentLang) return;

    currentLang = lang;
    if (typeof window.PersonalizationConfig !== 'undefined') {
        window.PersonalizationConfig.setCurrentLanguage(lang);
    }

    // Cập nhật cấu hình người nhận theo ngôn ngữ mới
    initializePersonalization(lang);

    // Cập nhật toàn bộ giao diện
    applyLanguage(lang, true);

    // Cập nhật URL query an toàn (chỉ khi trang được phục vụ qua HTTP/HTTPS)
    if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            // Tránh lỗi ở môi trường sandbox
        }
    }
}

function applyLanguage(lang, animated = false) {
    if (typeof window.PersonalizationConfig === 'undefined') return;
    const t = (key) => window.PersonalizationConfig.t(key, lang);

    // Cập nhật thuộc tính lang của HTML & Tiêu đề trang
    document.documentElement.lang = lang;
    document.title = t('pageTitle');

    // Cập nhật Language Toggle Button (Cờ & Tooltip)
    if (currentLangFlag) {
        currentLangFlag.textContent = lang === 'ja' ? '🇯🇵' : '🇻🇳';
    }
    if (langToggleBtn) {
        langToggleBtn.title = lang === 'ja'
            ? 'Tiếng Việtに切り替え / Chuyển sang Tiếng Việt'
            : '日本語に切り替え / Chuyển sang 日本語';
        if (animated) {
            langToggleBtn.classList.add('switching');
            setTimeout(() => langToggleBtn.classList.remove('switching'), 400);
        }
    }

    // Cập nhật Header
    if (mainTitleLine1) mainTitleLine1.textContent = t('mainTitleLine1');
    if (mainTitleLine2) mainTitleLine2.textContent = t('mainTitleLine2');
    if (mainTitleLine3) mainTitleLine3.textContent = t('mainTitleLine3');

    // Cập nhật Subtitle Message
    updateSubtitleMessage();

    // Cập nhật Blow Button & Instruction
    if (blowText) {
        if (candlesHaveBeenBlown || candlesBlownOut > 0) {
            blowText.textContent = t('blowingButton');
        } else {
            blowText.textContent = t('blowButton');
        }
    }
    if (blowInstruction) {
        blowInstruction.textContent = t('blowInstruction');
    }

    // Cập nhật Wishes Section
    if (wishesTitle) {
        wishesTitle.textContent = t('wishesTitle');
    }
    renderWishesList(lang);

    // Cập nhật Music Button
    updateMusicButtonState();

    // Cập nhật Surprise Button & Section
    const surpriseSection = document.querySelector('.surprise-section');
    if (surpriseSection) {
        surpriseSection.style.display = personalConfig.showSurprise === false ? 'none' : 'block';
    }
    const surpriseText = document.getElementById('surpriseText');
    if (surpriseText) {
        surpriseText.textContent = t('surpriseButton');
    }

    // Cập nhật Explosion Gallery
    if (explosionTitle) explosionTitle.textContent = t('explosionTitle');
    if (explosionInstruction) explosionInstruction.textContent = t('explosionInstruction');
    if (explosionGallery && explosionGallery.classList.contains('active')) {
        createCarousel3D();
    }

    // Cập nhật Gallery Display
    updateGalleryDisplay();
}

function renderWishesList(lang) {
    if (!wishesContainer || typeof window.PersonalizationConfig === 'undefined') return;

    const wishesList = window.PersonalizationConfig.t('wishes', lang);
    if (!Array.isArray(wishesList) || wishesList.length === 0) return;

    wishesContainer.innerHTML = '';
    wishesList.forEach((wishText, idx) => {
        const p = document.createElement('p');
        p.className = `wish ${idx === 0 ? 'active' : ''}`;
        p.textContent = wishText;
        wishesContainer.appendChild(p);
    });

    wishIndex = 0;
    initializeWishRotation();
}

// ===== CANDLE BLOWING FUNCTIONALITY =====
function blowCandles() {
    // Check if candles have already been blown once
    if (candlesHaveBeenBlown) {
        const msg = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('alreadyBlownMessage', currentLang)
            : '🕯️ ろうそくはもう吹き消されました！';
        showMessage(msg);
        return;
    }

    blowButton.classList.add('active');

    // Play blow sound effect
    playBlowSoundEffect();
    // Phát nhạc ngay lập tức khi bấm thổi nến
    startMusic();

    // Mark that candles have been blown
    candlesHaveBeenBlown = true;

    // Disable the blow button
    blowButton.disabled = true;
    blowButton.style.opacity = '0.6';
    blowButton.style.cursor = 'not-allowed';
    const blowingText = typeof window.PersonalizationConfig !== 'undefined'
        ? window.PersonalizationConfig.t('blowingButton', currentLang)
        : '🌬️ 吹き消しています...';
    if (blowText) blowText.textContent = blowingText;

    // Blow out all remaining candles
    document.querySelectorAll('.flame:not(.blown-out)').forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('blown-out');
            candlesBlownOut++;

            // Create smoke effect
            createSmokeEffect(flame);

            // Check if all candles are blown out
            if (candlesBlownOut >= totalCandles) {
                setTimeout(() => {
                    celebrateAllCandlesBlown();
                }, 500);
            }
        }, index * 200);
    });

    // Reset button state
    setTimeout(() => {
        blowButton.classList.remove('active');
    }, 600);
}

function blowSingleCandle(candleIndex) {
    const flame = document.querySelector(`.flame-${candleIndex + 1}`);
    if (flame && !flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out');
        candlesBlownOut++;

        // Play blow sound effect
        playBlowSoundEffect();

        createSmokeEffect(flame);

        // If this is the first candle being blown, disable button to encourage individual blowing
        if (candlesBlownOut === 1) {
            blowButton.disabled = true;
            blowButton.style.opacity = '0.6';
            blowButton.style.cursor = 'not-allowed';
            const blowingText = typeof window.PersonalizationConfig !== 'undefined'
                ? window.PersonalizationConfig.t('blowingButton', currentLang)
                : '🌬️ 吹き消しています...';
            if (blowText) blowText.textContent = blowingText;
        }

        // Check if all candles are blown out
        if (candlesBlownOut >= totalCandles) {
            candlesHaveBeenBlown = true;
            // Bật nhạc khi đã thổi tắt hết toàn bộ các cây nến
            startMusic();
            setTimeout(() => {
                celebrateAllCandlesBlown();
            }, 500);
        }
    }
}

function celebrateAllCandlesBlown() {
    // 1. Kích hoạt hiệu ứng vòng tròn sáng thu nhỏ từ từ & mượt mà về giữa bánh (1.8s)
    if (lightingOverlay) {
        lightingOverlay.classList.add('iris-shrink');
    }

    // 2. Sau 1.8s khi bóng tối vừa trùm kín tất cả, bắt đầu mở sáng lại TỪ TỪ mượt mà + bùng nổ pháo hoa & âm thanh
    setTimeout(() => {
        turnLightsOn();

        // Âm thanh vỗ tay, reo hò & pháo hoa bùng nổ khi bắt đầu mở sáng
        playApplauseSound();
        playCheeringSound();
        createConfettiExplosion(60);
        createFireworks();

        const allBlownMsg = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('allBlownMessage', currentLang)
            : '🎉 おめでとうございます！すべての願いが叶いますように！ 🎉';
        showMessage(allBlownMsg);

        const specialWishMsg = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('specialWish', currentLang)
            : '✨ ろうそくを全部吹き消しましたね！素敵な夢がたくさん叶いますように！ ✨';
        showSpecialWish(specialWishMsg);
    }, 1800);
}

function turnLightsOn() {
    if (lightingOverlay) {
        lightingOverlay.classList.add('lights-on');
        setTimeout(() => {
            lightingOverlay.style.display = 'none';
        }, 2500); // Mở sáng từ từ mượt mà trong 2.5 giây
    }
}

// ===== SMOKE EFFECT =====
function createSmokeEffect(flame) {
    const smoke = document.createElement('div');
    smoke.style.cssText = `
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 20px;
        background: rgba(200, 200, 200, 0.7);
        border-radius: 2px;
        animation: smokeRise 2s ease-out forwards;
        pointer-events: none;
    `;

    flame.parentElement.appendChild(smoke);

    setTimeout(() => {
        if (smoke.parentElement) {
            smoke.parentElement.removeChild(smoke);
        }
    }, 2000);
}

// ===== SURPRISE FUNCTIONALITY =====
function triggerSurprise() {
    if (surpriseButton) {
        surpriseButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            surpriseButton.style.transform = 'scale(1)';
        }, 150);
    }

    // Open 3D explosion gallery
    openExplosionGallery();

    // Multiple surprise effects
    createConfettiExplosion(30);
    createFireworks();

    // Play applause sound
    playApplauseSound();

    triggerBalloonDance();
    showSurpriseMessage();

    // Special cake animation
    animateCake();
}

function showSurpriseMessage() {
    const messages = typeof window.PersonalizationConfig !== 'undefined'
        ? window.PersonalizationConfig.t('surpriseMessages', currentLang)
        : [
            '🎊 サプライズ！お誕生日おめでとうございます！ 🎊',
            '🎁 あなたへの特別なプレゼント！ 🎁',
            '🌟 あなたは本当に素晴らしい！ハッピーバースデー！ 🌟'
        ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showMessage(randomMessage);
}

function animateCake() {
    const cake = document.querySelector('.cake');
    if (cake) {
        cake.style.animation = 'none';
        void cake.offsetWidth;
        cake.style.animation = 'cakeJump 1s ease-out';
    }
}

function triggerBalloonDance() {
    document.querySelectorAll('.balloon').forEach((balloon, index) => {
        balloon.style.animation = 'none';
        void balloon.offsetWidth;
        balloon.style.animation = `balloonDance 2s ease-in-out ${index * 0.2}s`;
    });
}

// ===== CONFETTI SYSTEM =====
function createConfettiExplosion(count = 20) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#feca57', '#ff9ff3', '#54a0ff'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createConfettiPiece(colors);
        }, i * 50);
    }
}

function createConfettiPiece(colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * window.innerWidth;
    const rotation = Math.random() * 360;
    const scale = 0.5 + Math.random() * 0.5;

    confetti.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: -10px;
        width: 10px;
        height: 10px;
        background-color: ${color};
        border-radius: 50%;
        transform: rotate(${rotation}deg) scale(${scale});
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
        animation-delay: ${Math.random() * 0.5}s;
        pointer-events: none;
        z-index: 1000;
    `;

    if (confettiContainer) {
        confettiContainer.appendChild(confetti);
    } else {
        document.body.appendChild(confetti);
    }

    setTimeout(() => {
        if (confetti.parentElement) {
            confetti.parentElement.removeChild(confetti);
        }
    }, 4000);
}

// ===== FIREWORKS SYSTEM =====
function createFireworks() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#feca57', '#ff9ff3'];

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(colors);
        }, i * 300);
    }
}

function createFirework(colors) {
    const x = 50 + Math.random() * (window.innerWidth - 100);
    const y = 50 + Math.random() * (window.innerHeight / 2);

    const particleCount = 12;
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';

        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = 40 + Math.random() * 40;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;

        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background-color: ${color};
            border-radius: 50%;
            animation: firework-explosion 1s ease-out forwards;
            transform: translate(${deltaX}px, ${deltaY}px);
            box-shadow: 0 0 10px ${color};
            pointer-events: none;
            z-index: 1000;
        `;

        if (fireworksContainer) {
            fireworksContainer.appendChild(particle);
        } else {
            document.body.appendChild(particle);
        }

        setTimeout(() => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        }, 1000);
    }
}

// ===== MUSIC FUNCTIONALITY =====
function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

function startMusic() {
    musicPlaying = true;
    updateMusicButtonState();

    if (birthdaySong) {
        birthdaySong.currentTime = 0;
        birthdaySong.play().catch(e => console.log('Audio play failed:', e));
    }
}

function stopMusic() {
    musicPlaying = false;
    updateMusicButtonState();

    if (birthdaySong) {
        birthdaySong.pause();
        birthdaySong.currentTime = 0;
    }

    if (currentMelodyTimeout) {
        clearTimeout(currentMelodyTimeout);
        currentMelodyTimeout = null;
    }

    if (window.audioContext) {
        window.audioContext.close();
        window.audioContext = null;
    }
}

function updateMusicButtonState() {
    if (musicIcon && musicText) {
        const musicPauseText = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('musicPause', currentLang)
            : '音楽 OFF';
        const musicPlayText = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('musicPlay', currentLang)
            : '音楽 ON';

        if (musicPlaying) {
            musicIcon.textContent = '🎵';
            musicText.textContent = musicPauseText;
            if (musicToggle) musicToggle.classList.add('playing');
        } else {
            musicIcon.textContent = '🔇';
            musicText.textContent = musicPlayText;
            if (musicToggle) musicToggle.classList.remove('playing');
        }
    }
}

// ===== SOUND EFFECTS =====
function getAudioContext() {
    try {
        if (!window._sharedAudioCtx || window._sharedAudioCtx.state === 'closed') {
            window._sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window._sharedAudioCtx.state === 'suspended') {
            window._sharedAudioCtx.resume();
        }
        return window._sharedAudioCtx;
    } catch (e) {
        return null;
    }
}

function playBlowSoundEffect() {
    if (blowSound) {
        blowSound.volume = 0.5;
        blowSound.currentTime = 0;
        blowSound.play().catch(e => console.log('Blow sound audio element failed:', e));
    }

    try {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        const bufferSize = Math.floor(audioContext.sampleRate * 0.5); // 0.5 giây tiếng thổi
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;

        // Lowpass filter tạo hiệu ứng tiếng phù / thổi hơi nhẹ nhàng
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.5);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        noise.start(audioContext.currentTime);
        noise.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio Context error in playBlowSoundEffect:', error);
    }
}

function playApplauseSound() {
    try {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (audioContext.state === 'closed') return;
                const bufferSize = Math.floor(audioContext.sampleRate * 0.15);
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const output = buffer.getChannelData(0);

                for (let j = 0; j < bufferSize; j++) {
                    output[j] = (Math.random() * 2 - 1) * 0.8;
                }

                const whiteNoise = audioContext.createBufferSource();
                whiteNoise.buffer = buffer;

                const bandpass = audioContext.createBiquadFilter();
                bandpass.type = 'bandpass';
                bandpass.frequency.value = 800 + Math.random() * 800;
                bandpass.Q.value = 2;

                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0.18, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.15);

                whiteNoise.connect(bandpass);
                bandpass.connect(gainNode);
                gainNode.connect(audioContext.destination);

                whiteNoise.start(audioContext.currentTime);
                whiteNoise.stop(audioContext.currentTime + 0.15);
            }, i * 80 + Math.random() * 120);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playCheeringSound() {
    try {
        const audioContext = getAudioContext();
        if (!audioContext) return;
        const cheerPitches = [400, 500, 600, 700, 800];

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                if (audioContext.state === 'closed') return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                const pitch = cheerPitches[Math.floor(Math.random() * cheerPitches.length)];
                oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.5, audioContext.currentTime + 0.3);
                oscillator.type = 'triangle';

                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.4);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            }, i * 200 + Math.random() * 200);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playExplosionSound() {
    try {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (audioContext.state === 'closed') return;
                // Bass explosion
                const bassOsc = audioContext.createOscillator();
                const bassGain = audioContext.createGain();

                bassOsc.connect(bassGain);
                bassGain.connect(audioContext.destination);

                bassOsc.frequency.setValueAtTime(80, audioContext.currentTime);
                bassOsc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.3);
                bassOsc.type = 'sawtooth';

                bassGain.gain.setValueAtTime(0, audioContext.currentTime);
                bassGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02);
                bassGain.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.3);

                bassOsc.start(audioContext.currentTime);
                bassOsc.stop(audioContext.currentTime + 0.3);

                // High frequency sparkle
                const sparkleOsc = audioContext.createOscillator();
                const sparkleGain = audioContext.createGain();

                sparkleOsc.connect(sparkleGain);
                sparkleGain.connect(audioContext.destination);

                sparkleOsc.frequency.setValueAtTime(2000 + Math.random() * 2000, audioContext.currentTime);
                sparkleOsc.frequency.exponentialRampToValueAtTime(4000 + Math.random() * 2000, audioContext.currentTime + 0.2);
                sparkleOsc.type = 'triangle';

                sparkleGain.gain.setValueAtTime(0, audioContext.currentTime);
                sparkleGain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.01);
                sparkleGain.gain.exponentialRampToValueAtTime(0.003, audioContext.currentTime + 0.2);

                sparkleOsc.start(audioContext.currentTime);
                sparkleOsc.stop(audioContext.currentTime + 0.2);
            }, i * 100);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

// ===== PHOTO GALLERY SYSTEM (ZOOM MODAL) =====
function initializeGallery() {
    if (totalPhotosSpan) {
        totalPhotosSpan.textContent = photoData.length || 0;
    }
    updateGalleryDisplay();
}

function openPhotoGallery(index) {
    if (typeof index === 'number') {
        currentPhotoIndex = index;
    }
    updateGalleryDisplay();
    if (photoGallery) {
        photoGallery.classList.add('active');
        startGalleryAutoSlide();
    }
}

function closePhotoGallery() {
    if (photoGallery) {
        photoGallery.classList.remove('active');
        stopGalleryAutoSlide();
    }
}

function updateGalleryDisplay() {
    if (!photoData || photoData.length === 0) return;

    const photo = photoData[currentPhotoIndex] || photoData[0];
    if (!photo) return;

    if (galleryImage) {
        galleryImage.src = photo.src;
        galleryImage.alt = photo.title;
    }
    if (photoTitle) photoTitle.textContent = photo.title;
    if (photoDescription) photoDescription.textContent = photo.description;
    if (currentPhotoNum) currentPhotoNum.textContent = currentPhotoIndex + 1;
    if (totalPhotosSpan) totalPhotosSpan.textContent = photoData.length;

    // Update progress bar
    if (progressFill && photoData.length > 0) {
        const progressPercent = ((currentPhotoIndex + 1) / photoData.length) * 100;
        progressFill.style.width = progressPercent + '%';
    }
}

function nextPhoto() {
    if (!photoData || photoData.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
    updateGalleryDisplay();
    resetAutoSlideTimer();
}

function previousPhoto() {
    if (!photoData || photoData.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
    updateGalleryDisplay();
    resetAutoSlideTimer();
}

function startGalleryAutoSlide() {
    galleryAutoSlideTimeout = setInterval(() => {
        nextPhoto();
    }, 2500);
}

function stopGalleryAutoSlide() {
    if (galleryAutoSlideTimeout) {
        clearInterval(galleryAutoSlideTimeout);
        galleryAutoSlideTimeout = null;
    }
}

function resetAutoSlideTimer() {
    stopGalleryAutoSlide();
    startGalleryAutoSlide();
}

// ===== 3D ROTATING PHOTO CAROUSEL =====
function openExplosionGallery() {
    if (!photoData || photoData.length === 0) {
        if (typeof window.PersonalizationConfig !== 'undefined') {
            photoData = window.PersonalizationConfig.generatePhotoSet("anh-tai", "jpg", 8, null, currentLang);
        }
    }

    if (explosionGallery) {
        explosionGallery.classList.add('active');
        createCarousel3D();
        startCarousel3D();
        playExplosionSound();
    }
}

function closeExplosionGallery() {
    if (explosionGallery) {
        explosionGallery.classList.remove('active');
    }
    if (carouselAnimationFrame) {
        cancelAnimationFrame(carouselAnimationFrame);
        carouselAnimationFrame = null;
    }
    closePhotoGallery();
}

function createCarousel3D() {
    if (!carouselRing) return;
    carouselRing.innerHTML = '';

    if (!photoData || photoData.length === 0) return;

    const count = photoData.length;
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;

    const cardWidth = isMobile ? 115 : isTablet ? 140 : 180;
    const minRadius = isMobile ? 170 : isTablet ? 230 : 290;
    const calculatedRadius = Math.round((cardWidth / 2) / Math.tan(Math.PI / Math.max(count, 3)) + 40);
    const radius = Math.max(minRadius, calculatedRadius);

    const angleStep = 360 / count;

    photoData.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.dataset.index = index;

        const cardAngle = index * angleStep;
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

        card.innerHTML = `<img src="${photo.src}" alt="${photo.title || ''}" loading="lazy">`;

        card.addEventListener('click', (e) => {
            if (carouselDragMoved) return;
            openPhotoGallery(index);
        });

        carouselRing.appendChild(card);
    });

    setupCarouselInteractions();
}

function setupCarouselInteractions() {
    if (carouselListenersAdded || !carouselStage) return;
    carouselListenersAdded = true;

    // Mouse drag interactions
    carouselStage.addEventListener('mousedown', (e) => {
        carouselIsDragging = true;
        carouselDragStartX = e.clientX;
        carouselDragStartRotation = carouselTargetRotation;
        carouselDragMoved = false;
        carouselStage.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!carouselIsDragging) return;
        const dx = e.clientX - carouselDragStartX;
        if (Math.abs(dx) > 5) {
            carouselDragMoved = true;
        }
        carouselTargetRotation = carouselDragStartRotation + dx * 0.45;
    });

    window.addEventListener('mouseup', () => {
        if (carouselIsDragging) {
            carouselIsDragging = false;
            if (carouselStage) carouselStage.classList.remove('dragging');
            setTimeout(() => {
                carouselDragMoved = false;
            }, 60);
        }
    });

    // Touch swipe interactions (Mobile/Tablet)
    carouselStage.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        carouselIsDragging = true;
        carouselDragStartX = e.touches[0].clientX;
        carouselDragStartRotation = carouselTargetRotation;
        carouselDragMoved = false;
    }, { passive: true });

    carouselStage.addEventListener('touchmove', (e) => {
        if (!carouselIsDragging || !e.touches || e.touches.length === 0) return;
        const dx = e.touches[0].clientX - carouselDragStartX;
        if (Math.abs(dx) > 5) {
            carouselDragMoved = true;
        }
        carouselTargetRotation = carouselDragStartRotation + dx * 0.55;
    }, { passive: true });

    carouselStage.addEventListener('touchend', () => {
        carouselIsDragging = false;
        setTimeout(() => {
            carouselDragMoved = false;
        }, 60);
    });

    // Hover pause
    carouselStage.addEventListener('mouseenter', () => {
        carouselIsHovered = true;
    });
    carouselStage.addEventListener('mouseleave', () => {
        carouselIsHovered = false;
    });

    // Mouse wheel rotate
    carouselStage.addEventListener('wheel', (e) => {
        if (!explosionGallery || !explosionGallery.classList.contains('active')) return;
        e.preventDefault();
        carouselTargetRotation += e.deltaY * 0.2;
    }, { passive: false });
}

function startCarousel3D() {
    if (carouselAnimationFrame) {
        cancelAnimationFrame(carouselAnimationFrame);
    }

    function renderLoop() {
        if (!explosionGallery || !explosionGallery.classList.contains('active')) {
            return;
        }

        const isPhotoZoomed = photoGallery && photoGallery.classList.contains('active');

        if (!isPhotoZoomed) {
            if (!carouselIsDragging) {
                if (!carouselIsHovered) {
                    carouselTargetRotation += carouselAutoSpinSpeed;
                }
            }
            // Smooth interpolation
            carouselCurrentRotation += (carouselTargetRotation - carouselCurrentRotation) * 0.1;
            if (carouselRing) {
                carouselRing.style.transform = `rotateX(-3deg) rotateY(${carouselCurrentRotation}deg)`;
            }
        }

        carouselAnimationFrame = requestAnimationFrame(renderLoop);
    }

    carouselAnimationFrame = requestAnimationFrame(renderLoop);
}

// ===== WISH ROTATION =====
function initializeWishRotation() {
    if (wishRotationInterval) {
        clearInterval(wishRotationInterval);
        wishRotationInterval = null;
    }

    const wishes = document.querySelectorAll('.wish');
    if (wishes.length > 0) {
        wishRotationInterval = setInterval(() => {
            const currentWishes = document.querySelectorAll('.wish');
            if (currentWishes.length === 0) return;

            currentWishes[wishIndex % currentWishes.length].classList.remove('active');
            wishIndex = (wishIndex + 1) % currentWishes.length;
            currentWishes[wishIndex].classList.add('active');
        }, 3000);
    }
}

function showSpecialWish(message) {
    const currentWish = document.querySelector('.wish.active');
    if (currentWish) {
        currentWish.textContent = message;
        currentWish.style.animation = 'none';
        setTimeout(() => {
            currentWish.style.animation = 'bounceIn 0.8s ease-out';
        }, 50);
    }
}

// ===== MESSAGE SYSTEM (TOAST) =====
function showMessage(message) {
    const existingMessage = document.querySelector('.floating-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'floating-message';
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('closing');
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.parentElement.removeChild(messageDiv);
            }
        }, 400);
    }, 3200);
}

// ===== KEYBOARD SUPPORT =====
function handleKeyPress(event) {
    if (photoGallery && photoGallery.classList.contains('active')) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                previousPhoto();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextPhoto();
                break;
            case 'Escape':
                event.preventDefault();
                closePhotoGallery();
                break;
        }
        return;
    }

    if (explosionGallery && explosionGallery.classList.contains('active')) {
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                closeExplosionGallery();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                carouselTargetRotation -= 25;
                break;
            case 'ArrowRight':
                event.preventDefault();
                carouselTargetRotation += 25;
                break;
        }
        return;
    }

    switch (event.key) {
        case ' ':
        case 'Enter':
            event.preventDefault();
            blowCandles();
            break;
        case 's':
        case 'S':
            triggerSurprise();
            break;
        case 'm':
        case 'M':
            toggleMusic();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            blowSingleCandle(parseInt(event.key) - 1);
            break;
    }
}

// ===== BACKGROUND ANIMATIONS =====
function createBackgroundAnimations() {
    const isMobile = window.innerWidth <= 768;
    const particleInterval = isMobile ? 4000 : 2000;
    const sparkleInterval = isMobile ? 3500 : 1500;

    setInterval(() => {
        if (!document.hidden) createFloatingParticle();
    }, particleInterval);

    setInterval(() => {
        if (!document.hidden) createSparkle();
    }, sparkleInterval);
}

function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        bottom: -10px;
        pointer-events: none;
        z-index: 5;
        animation: floatUp 8s linear forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => {
        if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
        }
    }, 8000);
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * (window.innerHeight * 0.8)}px;
        font-size: ${10 + Math.random() * 18}px;
        pointer-events: none;
        z-index: 5;
        animation: sparkleAnimation 2s ease-out forwards;
    `;

    document.body.appendChild(sparkle);

    setTimeout(() => {
        if (sparkle.parentElement) {
            sparkle.parentElement.removeChild(sparkle);
        }
    }, 2000);
}

// ===== INTRO ANIMATION =====
function playIntroAnimation() {
    setTimeout(() => {
        const welcomeMsg = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('welcomeMessage', currentLang)
            : (currentLang === 'vi' ? '🎂 Thổi tắt từng cây nến để ước các điều ước 🎂' : '🎂 ろうそくを1本ずつ吹き消して、願いを込めてくださいね！ 🎂');
        showMessage(welcomeMsg);
    }, 1000);

    setTimeout(() => {
        createConfettiExplosion(10);
    }, 2000);
}

// ===== MOBILE TOUCH SUPPORT =====
if ('ontouchstart' in window) {
    setTimeout(() => {
        const mobileInstruction = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('mobileInstruction', currentLang)
            : (currentLang === 'vi' ? '📱 Thổi tắt từng cây nến để ước các điều ước' : '📱 ろうそくを1本ずつ吹き消して、願いを込めてくださいね！');
        showMessage(mobileInstruction);
    }, 4500);
}