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
let candlesBlownOut = 0;
let musicPlaying = true; // Default to true (music on)
let wishIndex = 0;
const totalCandles = 5;
let currentMelodyTimeout = null;
let candlesHaveBeenBlown = false; // Track if candles have been blown once

// Personalization variables - sẽ được khởi tạo từ URL parameters
let birthdayName = "Anh Tài"; // Default value
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo personalization trước tiên
    initializePersonalization();
    
    initializeDOM();
    // Cập nhật tên sinh nhật vào subtitle
    const nameSpan = document.getElementById('birthdayName');
    if (nameSpan) {
        nameSpan.textContent = birthdayName;
    }
    
    // Cập nhật subtitle message
    updateSubtitleMessage();
    
    initializeWishRotation();
    initializeEventListeners();
    createBackgroundAnimations();
    playIntroAnimation();
    // Music will only start when blowing candles, not auto-start
});

// ===== PERSONALIZATION INITIALIZATION =====
function initializePersonalization() {
    // Lấy config từ URL parameters
    if (typeof window.PersonalizationConfig !== 'undefined') {
        personalConfig = window.PersonalizationConfig.getPersonConfig();
        birthdayName = personalConfig.name;
        photoData = personalConfig.photos;
        
        // Áp dụng theme color nếu có
        if (personalConfig.themeColor) {
            applyThemeColor(personalConfig.themeColor);
        }
        
        console.log('Personalization loaded:', personalConfig);
    } else {
        console.warn('PersonalizationConfig not found, using default values');
        // Fallback to default photos
        photoData = [
            {
                src: "res/img/tai_1.jpg",
                title: "🎂 Sinh Nhật Vui Vẻ",
                description: "Những khoảnh khắc hạnh phúc bên bánh kem",
            },
            // ... thêm các ảnh default khác
        ];
    }
}

function updateSubtitleMessage() {
    const subtitleElement = document.querySelector('.subtitle');
    if (subtitleElement && personalConfig.customMessage) {
        const messageText = personalConfig.customMessage.replace('{name}', `<span id="birthdayName" class="highlight-name">${birthdayName}</span>`);
        subtitleElement.innerHTML = messageText;
    }
}

function applyThemeColor(color) {
    // Áp dụng theme color cho các elements
    const root = document.documentElement;
    root.style.setProperty('--theme-color', color);
    
    // Cập nhật CSS động
    const style = document.createElement('style');
    style.textContent = `
        .highlight-name {
            color: ${color} !important;
        }
        .explosion-image {
            border-color: ${color} !important;
            box-shadow: 0 10px 30px ${color}66 !important;
        }
        .explosion-close {
            border-color: ${color} !important;
            color: ${color} !important;
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
    blowButton.addEventListener('click', blowCandles);
    surpriseButton.addEventListener('click', triggerSurprise);
    musicToggle.addEventListener('click', toggleMusic);
    
    // Add click handlers for individual candles
    document.querySelectorAll('.candle').forEach((candle, index) => {
        candle.addEventListener('click', () => blowSingleCandle(index));
    });
    
    // Gallery event listeners
    prevPhotoBtn.addEventListener('click', previousPhoto);
    nextPhotoBtn.addEventListener('click', nextPhoto);
    closeGalleryBtn.addEventListener('click', closePhotoGallery);
    
    // Close gallery when clicking outside
    photoGallery.addEventListener('click', (e) => {
        if (e.target === photoGallery) {
            closePhotoGallery();
        }
    });
    
    // Explosion gallery event listeners
    closeExplosion.addEventListener('click', closeExplosionGallery);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize gallery
    initializeGallery();
    
    // Initialize music button state
    updateMusicButtonState();
}

// ===== CANDLE BLOWING FUNCTIONALITY =====
function blowCandles() {
    // Check if candles have already been blown once
    if (candlesHaveBeenBlown) {
        showMessage('🕯️ Nến đã được thổi rồi! Hãy tận hưởng khoảnh khắc này! 🎉');
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
    // Check if candles have already been blown once
    if (candlesHaveBeenBlown) {
        showMessage('🕯️ Nến đã được thổi rồi! Hãy tận hưởng khoảnh khắc này! 🎉');
        return;
    }

    const flame = document.querySelector(`.flame-${candleIndex + 1}`);
    if (flame && !flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out');
        candlesBlownOut++;
        
        // Play blow sound effect
        playBlowSoundEffect();
        // Phát nhạc ngay lập tức khi thổi nến
        startMusic();
        
        createSmokeEffect(flame);
        
        // If this is the first candle being blown, mark as blown and disable button
        if (candlesBlownOut === 1) {
            candlesHaveBeenBlown = true;
            blowButton.disabled = true;
            blowButton.style.opacity = '0.6';
            blowButton.style.cursor = 'not-allowed';
        }
        
        if (candlesBlownOut >= totalCandles) {
            setTimeout(() => {
                celebrateAllCandlesBlown();
            }, 500);
        }
    }
}

function celebrateAllCandlesBlown() {
    // Show celebration message
    showMessage('🎉 Chúc mừng! Tất cả ước mơ sẽ thành hiện thực! 🎉');
    
    // Play applause and cheering sounds instead of sparklers
    playApplauseSound();
    playCheeringSound();
    
    // Trigger massive confetti
    createConfettiExplosion(50);
    
    // Create fireworks
    createFireworks();
    
    // Change wish to celebration
    showSpecialWish('✨ Chúc mừng bạn đã thổi tắt tất cả nến! Mọi ước mơ đều sẽ thành hiện thực! ✨');
    
    // Turn the lights back on after celebration
    setTimeout(() => {
        turnLightsOn();
        showMessage('💡 Đèn đã được bật lại! Chúc mừng sinh nhật! 🎂');
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
    
    // Add smoke animation
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
    surpriseButton.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        surpriseButton.style.transform = 'scale(1)';
    }, 150);
    
    // Open 3D explosion gallery instead of regular gallery
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
    const messages = [
        '🎊 Bất ngờ! Chúc bạn sinh nhật vui vẻ! 🎊',
        '🎁 Món quà đặc biệt dành cho bạn! 🎁',
        '🌟 Bạn thật tuyệt vời! Chúc mừng sinh nhật! 🌟',
        '🎈 Hy vọng ngày hôm nay thật đặc biệt với bạn! 🎈',
        '💝 Gửi bạn những lời chúc tốt đẹp nhất! 💝'
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
        
        // Add jump animation if it doesn't exist
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
    
    // Add balloon dance animation
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

// ===== SPARKLER EFFECT REMOVED - REPLACED WITH APPLAUSE & CHEERING =====

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
    
    // Add confetti animation if not exists
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
    
    confettiContainer.appendChild(confetti);
    
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
        
        // Add firework animation if not exists
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
        
        fireworksContainer.appendChild(particle);
        
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
    
    // Play HTML5 audio
    if (birthdaySong) {
        birthdaySong.currentTime = 0;
        birthdaySong.play().catch(e => console.log('Audio play failed:', e));
    }
    // Không phát Web Audio API nữa để tránh bị đè tiếng chuông
}

function stopMusic() {
    musicPlaying = false;
    updateMusicButtonState();
    
    // Stop HTML5 audio
    if (birthdaySong) {
        birthdaySong.pause();
        birthdaySong.currentTime = 0;
    }
    
    // Clear any scheduled melody
    if (currentMelodyTimeout) {
        clearTimeout(currentMelodyTimeout);
        currentMelodyTimeout = null;
    }
    
    // Stop any playing audio context
    if (window.audioContext) {
        window.audioContext.close();
        window.audioContext = null;
    }
}

function updateMusicButtonState() {
    if (musicIcon && musicText) {
        if (musicPlaying) {
            musicIcon.textContent = '🎵';
            musicText.textContent = 'Tắt Nhạc';
            if (musicToggle) musicToggle.style.background = 'rgba(255, 255, 255, 0.3)';
        } else {
            musicIcon.textContent = '🔇';
            musicText.textContent = 'Bật Nhạc';
            if (musicToggle) musicToggle.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }
}

function playFullBirthdayMelody() {
    try {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Full "Happy Birthday to You" melody - HIGHER PITCH VERSION (moved up one octave + 50%)
        const melody = [
            // "Happy birthday to you" (first line) - Higher and more cheerful
            { note: 528, duration: 0.75 }, // C5 (was C4)
            { note: 528, duration: 0.25 },
            { note: 594, duration: 1 },    // D5 (was D4)
            { note: 528, duration: 1 },    // C5 (was C4)
            { note: 704, duration: 1 },    // F5 (was F4)
            { note: 660, duration: 2 },    // E5 (was E4)
            
            // "Happy birthday to you" (second line)
            { note: 528, duration: 0.75 },
            { note: 528, duration: 0.25 },
            { note: 594, duration: 1 },
            { note: 528, duration: 1 },
            { note: 792, duration: 1 },    // G5 (was G4)
            { note: 704, duration: 2 },    // F5 (was F4)
            
            // "Happy birthday dear [name]" (third line)
            { note: 528, duration: 0.75 },
            { note: 528, duration: 0.25 },
            { note: 1056, duration: 1 },   // C6 (was C5)
            { note: 880, duration: 1 },    // A5 (was A4)
            { note: 704, duration: 1 },    // F5 (was F4)
            { note: 660, duration: 1 },    // E5 (was E4)
            { note: 594, duration: 2 },    // D5 (was D4)
            
            // "Happy birthday to you" (final line)
            { note: 932, duration: 0.75 }, // Bb5 (was Bb4)
            { note: 932, duration: 0.25 },
            { note: 880, duration: 1 },    // A5 (was A4)
            { note: 704, duration: 1 },    // F5 (was F4)
            { note: 792, duration: 1 },    // G5 (was G4)
            { note: 704, duration: 3 },    // F5 (was F4)
        ];
        
        let currentTime = window.audioContext.currentTime;
        
        melody.forEach((note) => {
            if (musicPlaying) {
                playNote(note.note, currentTime, note.duration * 0.5); // Also made faster tempo
                currentTime += note.duration * 0.5;
            }
        });
        
        // Loop the melody after a shorter pause for more lively feel
        if (musicPlaying) {
            const totalDuration = melody.reduce((sum, note) => sum + note.duration * 0.5, 0);
            currentMelodyTimeout = setTimeout(() => {
                if (musicPlaying) playFullBirthdayMelody();
            }, (totalDuration + 1.5) * 1000);
        }
    } catch (error) {
        console.log('Web Audio API not supported in this browser');
    }
}

function playNote(frequency, startTime, duration) {
    if (!window.audioContext) return;
    
    // Main oscillator with brighter tone
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    // Add a second oscillator for harmonics (makes it more cheerful)
    const harmonic = window.audioContext.createOscillator();
    const harmonicGain = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    harmonic.connect(harmonicGain);
    gainNode.connect(window.audioContext.destination);
    harmonicGain.connect(window.audioContext.destination);
    
    // Main note
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'triangle'; // Brighter than sine
    
    // Harmonic at 5th (adds brightness and cheerfulness)
    harmonic.frequency.setValueAtTime(frequency * 1.5, startTime);
    harmonic.type = 'sine';
    
    // Main note volume
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.9, startTime + 0.1); // 0.12 * 6
    gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + duration); // 0.01 * 6
    
    // Harmonic volume (softer)
    harmonicGain.gain.setValueAtTime(0, startTime);
    harmonicGain.gain.linearRampToValueAtTime(0.9, startTime + 0.1); // 0.04 * 6
    harmonicGain.gain.exponentialRampToValueAtTime(0.03, startTime + duration); // 0.001 * 6
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    harmonic.start(startTime);
    harmonic.stop(startTime + duration);
}

// ===== SOUND EFFECTS =====
function playBlowSoundEffect() {
    // Use HTML5 audio element if available
    if (blowSound) {
        blowSound.currentTime = 0;
        blowSound.play().catch(e => console.log('Blow sound failed:', e));
    }
    
    // Fallback to Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'white';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.1); // 0.1 * 6
    gainNode.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.5); // 0.01 * 6
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playApplauseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create realistic applause sound using filtered noise
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
                gainNode.gain.setValueAtTime(0.18, audioContext.currentTime); // 0.03 * 6
                gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.15); // 0.001 * 6
                
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
        
        // Create cheering "Yay!" sounds with varying pitches
        const cheerPitches = [400, 500, 600, 700, 800];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Random pitch for variety
                const pitch = cheerPitches[Math.floor(Math.random() * cheerPitches.length)];
                oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.5, audioContext.currentTime + 0.3);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.48, audioContext.currentTime + 0.05); // 0.08 * 6
                gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.4); // 0.001 * 6
                
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
        
        // Create dramatic explosion sound effect
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
        totalPhotosSpan.textContent = photoData.length;
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
    const photo = photoData[currentPhotoIndex];
    
    if (galleryImage) galleryImage.src = photo.src;
    if (galleryImage) galleryImage.alt = photo.title;
    if (photoTitle) photoTitle.textContent = photo.title;
    if (photoDescription) photoDescription.textContent = photo.description;
    if (currentPhotoNum) currentPhotoNum.textContent = currentPhotoIndex + 1;
    
    // Update progress bar
    if (progressFill) {
        const progressPercent = ((currentPhotoIndex + 1) / photoData.length) * 100;
        progressFill.style.width = progressPercent + '%';
    }
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
    updateGalleryDisplay();
    resetAutoSlideTimer();
}

function previousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
    updateGalleryDisplay();
    resetAutoSlideTimer();
}

function startGalleryAutoSlide() {
    galleryAutoSlideTimeout = setInterval(() => {
        nextPhoto();
    }, 2500); // Auto slide every 2.5 seconds
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
        // Play special explosion sound
        playExplosionSound();
    }
}

function closeExplosionGallery() {
    if (explosionGallery) {
        explosionGallery.classList.remove('active');
        // Clear all explosion images
        const explosionImages = explosionGallery.querySelectorAll('.explosion-image');
        explosionImages.forEach(img => img.remove());
    }
}

function createExplosionImages() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Responsive radius calculation
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    
    const baseRadius = isMobile ? 150 : isTablet ? 250 : 300;
    const radiusVariation = isMobile ? 50 : isTablet ? 100 : 200;
    
    photoData.forEach((photo, index) => {
        setTimeout(() => {
            const explosionImg = document.createElement('div');
            explosionImg.className = 'explosion-image animate';
            
            // Calculate position in a circle around center
            const angle = (index / photoData.length) * Math.PI * 2;
            const radius = baseRadius + Math.random() * radiusVariation;
            const orbitRadius = radius * 0.3; // Smaller orbit for rotation
            
            const imgWidth = isMobile ? 150 : 200;
            const imgHeight = isMobile ? 112 : 150;
            
            const finalX = centerX + Math.cos(angle) * radius - imgWidth/2;
            const finalY = centerY + Math.sin(angle) * radius - imgHeight/2;
            
            // Orbit calculation for rotation animation
            const orbitX = Math.cos(angle) * orbitRadius;
            const orbitY = Math.sin(angle) * orbitRadius;
            
            // Random rotation for 3D effect
            const rotateX = Math.random() * 60 - 30;
            const rotateY = Math.random() * 60 - 30;
            const rotateZ = Math.random() * 30 - 15;
            
            explosionImg.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
            
            // Set initial position at center
            explosionImg.style.left = centerX - imgWidth/2 + 'px';
            explosionImg.style.top = centerY - imgHeight/2 + 'px';
            
            // Set CSS variables for animation
            explosionImg.style.setProperty('--final-x', finalX + 'px');
            explosionImg.style.setProperty('--final-y', finalY + 'px');
            explosionImg.style.setProperty('--orbit-x', orbitX + 'px');
            explosionImg.style.setProperty('--orbit-y', orbitY + 'px');
            explosionImg.style.setProperty('--rotate-x', rotateX + 'deg');
            explosionImg.style.setProperty('--rotate-y', rotateY + 'deg');
            explosionImg.style.setProperty('--rotate-z', rotateZ + 'deg');
            
            // Add click handler to open regular gallery
            explosionImg.addEventListener('click', () => {
                currentPhotoIndex = index;
                closeExplosionGallery();
                setTimeout(() => {
                    openPhotoGallery();
                }, 300);
            });
            
            explosionGallery.appendChild(explosionImg);
            
            // Animate to final position
            setTimeout(() => {
                explosionImg.style.left = explosionImg.style.getPropertyValue('--final-x');
                explosionImg.style.top = explosionImg.style.getPropertyValue('--final-y');
                // Initial transform will be handled by CSS animation
            }, 50);
            
        }, index * 150); // Stagger the animations
    });
}

// ===== WISH ROTATION =====
function initializeWishRotation() {
    const wishes = document.querySelectorAll('.wish');
    
    if (wishes.length > 0) {
        setInterval(() => {
            wishes[wishIndex].classList.remove('active');
            wishIndex = (wishIndex + 1) % wishes.length;
            wishes[wishIndex].classList.add('active');
        }, 3000);
    }
}

function showSpecialWish(message) {
    const wishesContainer = document.querySelector('.wishes-container');
    const currentWish = document.querySelector('.wish.active');
    
    if (currentWish) {
        currentWish.textContent = message;
        currentWish.style.animation = 'none';
        setTimeout(() => {
            currentWish.style.animation = 'bounceIn 0.8s ease-out';
        }, 50);
    }
}

// ===== MESSAGE SYSTEM =====
function showMessage(message) {
    // Remove existing message
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
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1.1rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: messageSlideIn 0.5s ease-out;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 215, 0, 0.5);
    `;
    
    // Add message animation
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
    }, 3000);
}

// ===== KEYBOARD SUPPORT =====
function handleKeyPress(event) {
    // Explosion gallery navigation
    if (explosionGallery && explosionGallery.classList.contains('active')) {
        switch(event.key) {
            case 'Escape':
                event.preventDefault();
                closeExplosionGallery();
                break;
        }
        return;
    }
    
    // Gallery navigation when gallery is open
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
    
    // General navigation
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
    // Add floating particles
    setInterval(createFloatingParticle, 2000);
    
    // Add random sparkles
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
        showMessage('🎂 Chào mừng đến với bữa tiệc sinh nhật! 🎂');
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
    
    // Add mobile-specific instructions
    setTimeout(() => {
        showMessage('📱Chạm Thổi nến để thổi bùng lên điều ước của bạn!');
    }, 5000);
}