// Hiệu ứng click vào mục tác giả chuyển hướng tới trang profile
document.addEventListener('DOMContentLoaded', function() {
    var authorCredit = document.getElementById('authorCredit');
    if (authorCredit) {
        authorCredit.addEventListener('click', function() {
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
document.addEventListener('DOMContentLoaded', function() {
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
        .explosion-image {
            border-color: ${cleanColor} !important;
            box-shadow: 0 10px 30px ${cleanColor}66 !important;
        }
        .explosion-close {
            border-color: ${cleanColor} !important;
            color: ${cleanColor} !important;
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
    
    // Explosion gallery elements
    explosionGallery = document.getElementById('explosionGallery');
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
        // Phát nhạc ngay lập tức khi thổi nến đầu tiên
        if (candlesBlownOut === 1) {
            startMusic();
        }
        
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
            setTimeout(() => {
                celebrateAllCandlesBlown();
            }, 500);
        }
    }
}

function celebrateAllCandlesBlown() {
    const allBlownMsg = typeof window.PersonalizationConfig !== 'undefined'
        ? window.PersonalizationConfig.t('allBlownMessage', currentLang)
        : '🎉 おめでとうございます！すべての願いが叶いますように！ 🎉';
    showMessage(allBlownMsg);
    
    // Play applause and cheering sounds
    playApplauseSound();
    playCheeringSound();
    
    // Trigger massive confetti
    createConfettiExplosion(50);
    
    // Create fireworks
    createFireworks();
    
    // Change wish to celebration
    const specialWishMsg = typeof window.PersonalizationConfig !== 'undefined'
        ? window.PersonalizationConfig.t('specialWish', currentLang)
        : '✨ ろうそくを全部吹き消しましたね！素敵な夢がたくさん叶いますように！ ✨';
    showSpecialWish(specialWishMsg);
    
    // Turn the lights back on after celebration
    setTimeout(() => {
        turnLightsOn();
        const lightsOnMsg = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('lightsOnMessage', currentLang)
            : '💡 明かりがつきました！ハッピーバースデー！ 🎂';
        showMessage(lightsOnMsg);
    }, 3000);
}

function turnLightsOn() {
    if (lightingOverlay) {
        lightingOverlay.classList.add('lights-on');
        setTimeout(() => {
            lightingOverlay.style.display = 'none';
        }, 2000); // Match CSS transition duration
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
    
    if (!document.querySelector('#smoke-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'smoke-styles';
        styleSheet.textContent = `
            @keyframes smokeRise {
                0% { opacity: 0.7; transform: translateX(-50%) translateY(0) scale(1); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(2); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
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
        
        setTimeout(() => {
            cake.style.animation = 'cakeJump 1s ease-out';
        }, 50);
        
        if (!document.querySelector('#cake-jump-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'cake-jump-styles';
            styleSheet.textContent = `
                @keyframes cakeJump {
                    0%, 100% { transform: translateY(0) scale(1); }
                    25% { transform: translateY(-20px) scale(1.1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                    75% { transform: translateY(-10px) scale(1.02); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
}

function triggerBalloonDance() {
    document.querySelectorAll('.balloon').forEach((balloon, index) => {
        balloon.style.animation = 'none';
        
        setTimeout(() => {
            balloon.style.animation = `balloonDance 2s ease-in-out ${index * 0.2}s`;
        }, 50);
    });
    
    if (!document.querySelector('#balloon-dance-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'balloon-dance-styles';
        styleSheet.textContent = `
            @keyframes balloonDance {
                0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
                25% { transform: translateY(-30px) rotate(10deg) scale(1.1); }
                50% { transform: translateY(-50px) rotate(-5deg) scale(1.05); }
                75% { transform: translateY(-20px) rotate(5deg) scale(1.02); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
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
    
    if (!document.querySelector('#confetti-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'confetti-styles';
        styleSheet.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
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
    const x = 100 + Math.random() * (window.innerWidth - 200);
    const y = 50 + Math.random() * (window.innerHeight / 2);
    
    const particleCount = 12;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        
        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
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
        
        if (!document.querySelector('#firework-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'firework-styles';
            styleSheet.textContent = `
                @keyframes firework-explosion {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        
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
function playBlowSoundEffect() {
    if (blowSound) {
        blowSound.volume = 0.5;
        blowSound.currentTime = 0;
        blowSound.play().catch(e => console.log('Blow sound audio element failed:', e));
    }
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const bufferSize = audioContext.sampleRate * 0.15;
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
            }, i * 80 + Math.random() * 150);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playCheeringSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const cheerPitches = [400, 500, 600, 700, 800];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const pitch = cheerPitches[Math.floor(Math.random() * cheerPitches.length)];
                oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.5, audioContext.currentTime + 0.3);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.48, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.4);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            }, i * 200 + Math.random() * 300);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playExplosionSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                // Bass explosion
                const bassOsc = audioContext.createOscillator();
                const bassGain = audioContext.createGain();
                
                bassOsc.connect(bassGain);
                bassGain.connect(audioContext.destination);
                
                bassOsc.frequency.setValueAtTime(80, audioContext.currentTime);
                bassOsc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.3);
                bassOsc.type = 'sawtooth';
                
                bassGain.gain.setValueAtTime(0, audioContext.currentTime);
                bassGain.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.02);
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
                sparkleGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                sparkleGain.gain.exponentialRampToValueAtTime(0.003, audioContext.currentTime + 0.2);
                
                sparkleOsc.start(audioContext.currentTime);
                sparkleOsc.stop(audioContext.currentTime + 0.2);
            }, i * 100);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

// ===== PHOTO GALLERY SYSTEM =====
function initializeGallery() {
    if (totalPhotosSpan) {
        totalPhotosSpan.textContent = photoData.length || 0;
    }
    updateGalleryDisplay();
}

function openPhotoGallery() {
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

// ===== 3D EXPLOSION GALLERY =====
function openExplosionGallery() {
    if (explosionGallery) {
        explosionGallery.classList.add('active');
        createExplosionImages();
        playExplosionSound();
    }
}

function closeExplosionGallery() {
    if (explosionGallery) {
        explosionGallery.classList.remove('active');
        const explosionImages = explosionGallery.querySelectorAll('.explosion-image');
        explosionImages.forEach(img => img.remove());
    }
}

function createExplosionImages() {
    if (!photoData || photoData.length === 0) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    
    const baseRadius = isMobile ? 150 : isTablet ? 140 : 180;
    const radiusVariation = isMobile ? 50 : isTablet ? 40 : 60;
    
    photoData.forEach((photo, index) => {
        setTimeout(() => {
            const explosionImg = document.createElement('div');
            explosionImg.className = 'explosion-image animate';
            
            const angle = (index / photoData.length) * Math.PI * 2;
            const radius = baseRadius + Math.random() * radiusVariation;
            const orbitRadius = radius * 0.3;
            
            const imgWidth = isMobile ? 150 : 200;
            const imgHeight = isMobile ? 112 : 150;
            
            const finalX = centerX + Math.cos(angle) * radius - imgWidth / 2;
            const finalY = centerY + Math.sin(angle) * radius - imgHeight / 2;
            
            const orbitX = Math.cos(angle) * orbitRadius;
            const orbitY = Math.sin(angle) * orbitRadius;
            
            const rotateX = Math.random() * 60 - 30;
            const rotateY = Math.random() * 60 - 30;
            const rotateZ = Math.random() * 30 - 15;
            
            explosionImg.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
            
            explosionImg.style.left = centerX - imgWidth / 2 + 'px';
            explosionImg.style.top = centerY - imgHeight / 2 + 'px';
            
            explosionImg.style.setProperty('--final-x', finalX + 'px');
            explosionImg.style.setProperty('--final-y', finalY + 'px');
            explosionImg.style.setProperty('--orbit-x', orbitX + 'px');
            explosionImg.style.setProperty('--orbit-y', orbitY + 'px');
            explosionImg.style.setProperty('--rotate-x', rotateX + 'deg');
            explosionImg.style.setProperty('--rotate-y', rotateY + 'deg');
            explosionImg.style.setProperty('--rotate-z', rotateZ + 'deg');
            
            explosionImg.addEventListener('click', () => {
                currentPhotoIndex = index;
                closeExplosionGallery();
                setTimeout(() => {
                    openPhotoGallery();
                }, 300);
            });
            
            explosionGallery.appendChild(explosionImg);
            
            setTimeout(() => {
                explosionImg.style.left = explosionImg.style.getPropertyValue('--final-x');
                explosionImg.style.top = explosionImg.style.getPropertyValue('--final-y');
            }, 50);
            
        }, index * 150);
    });
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
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        padding: 14px 28px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1.05rem;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
        z-index: 10000;
        animation: messageSlideIn 0.5s ease-out;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 215, 0, 0.6);
        max-width: 90%;
        text-align: center;
    `;
    
    if (!document.querySelector('#message-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'message-styles';
        styleSheet.textContent = `
            @keyframes messageSlideIn {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
            @keyframes messageSlideOut {
                0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease-out';
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.parentElement.removeChild(messageDiv);
            }
        }, 500);
    }, 3200);
}

// ===== KEYBOARD SUPPORT =====
function handleKeyPress(event) {
    if (explosionGallery && explosionGallery.classList.contains('active')) {
        switch(event.key) {
            case 'Escape':
                event.preventDefault();
                closeExplosionGallery();
                break;
        }
        return;
    }
    
    if (photoGallery && photoGallery.classList.contains('active')) {
        switch(event.key) {
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
    
    switch(event.key) {
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
    setInterval(createFloatingParticle, 2000);
    setInterval(createSparkle, 1500);
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
        top: ${window.innerHeight + 10}px;
        pointer-events: none;
        z-index: 5;
        animation: floatUp 8s linear forwards;
    `;
    
    if (!document.querySelector('#particle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-styles';
        styleSheet.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-${window.innerHeight + 100}px) translateX(${-50 + Math.random() * 100}px); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
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
        top: ${Math.random() * window.innerHeight}px;
        font-size: ${10 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 5;
        animation: sparkleAnimation 2s ease-out forwards;
    `;
    
    if (!document.querySelector('#sparkle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'sparkle-styles';
        styleSheet.textContent = `
            @keyframes sparkleAnimation {
                0% { opacity: 0; transform: scale(0) rotate(0deg); }
                50% { opacity: 1; transform: scale(1) rotate(180deg); }
                100% { opacity: 0; transform: scale(0) rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
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
            : '🎂 お誕生日パーティーへようこそ！ 🎂';
        showMessage(welcomeMsg);
    }, 1000);
    
    setTimeout(() => {
        createConfettiExplosion(10);
    }, 2000);
}

// ===== MOBILE TOUCH SUPPORT =====
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
            triggerSurprise();
        }
    });
    
    setTimeout(() => {
        const mobileInstruction = typeof window.PersonalizationConfig !== 'undefined'
            ? window.PersonalizationConfig.t('mobileInstruction', currentLang)
            : '📱画面をタップして、素敵な願いを込めましょう！';
        showMessage(mobileInstruction);
    }, 5000);
}