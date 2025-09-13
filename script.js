// ===== GLOBAL VARIABLES =====
let candlesBlownOut = 0;
let musicPlaying = true; // Default to true (music on)
let wishIndex = 0;
const totalCandles = 5;
let currentMelodyTimeout = null;

// Gallery variables
let currentPhotoIndex = 0;
let galleryAutoSlideTimeout = null;
const photoData = [
    {
        src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80',
        title: '🎂 Sinh Nhật Vui Vẻ',
        description: 'Những khoảnh khắc hạnh phúc bên bánh kem'
    },
    {
        src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80',
        title: '🎈 Tiệc Sinh Nhật',
        description: 'Bóng bay và niềm vui không ngừng'
    },
    {
        src: 'https://images.unsplash.com/photo-1558618666-fbd65c2cd40b?w=500&q=80',
        title: '🎁 Món Quà Đặc Biệt',
        description: 'Những món quà đầy ý nghĩa'
    },
    {
        src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80',
        title: '🕯️ Ước Mơ Thành Thật',
        description: 'Thổi nến và ước những điều tốt đẹp'
    },
    {
        src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80',
        title: '🎊 Kỷ Niệm Đáng Nhớ',
        description: 'Những kỷ niệm sinh nhật không thể nào quên'
    }
];

// ===== DOM ELEMENTS (Will be initialized after DOM loads) =====
let blowButton, surpriseButton, musicToggle, musicIcon, musicText;
let confettiContainer, fireworksContainer;
let photoGallery, galleryImage, photoTitle, photoDescription;
let prevPhotoBtn, nextPhotoBtn, closeGalleryBtn, currentPhotoNum, totalPhotosSpan, progressFill;
let birthdaySong, blowSound;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    initializeWishRotation();
    initializeEventListeners();
    createBackgroundAnimations();
    playIntroAnimation();
    
    // Auto-start music on page load
    setTimeout(() => {
        startMusic();
    }, 1000);
});

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
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize gallery
    initializeGallery();
    
    // Initialize music button state
    updateMusicButtonState();
}

// ===== CANDLE BLOWING FUNCTIONALITY =====
function blowCandles() {
    blowButton.classList.add('active');
    
    // Play blow sound effect
    playBlowSoundEffect();
    
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
    
    // Trigger sparkler effect from both sides
    createSparklerEffect();
    
    // Play sparkler sound
    playSparklerSound();
    
    // Trigger massive confetti
    createConfettiExplosion(50);
    
    // Create fireworks
    createFireworks();
    
    // Change wish to celebration
    showSpecialWish('✨ Chúc mừng bạn đã thổi tắt tất cả nến! Mọi ước mơ đều sẽ thành hiện thực! ✨');
    
    // Reset candles after 5 seconds
    setTimeout(resetCandles, 5000);
}

function resetCandles() {
    document.querySelectorAll('.flame').forEach(flame => {
        flame.classList.remove('blown-out');
    });
    candlesBlownOut = 0;
    showMessage('🕯️ Nến đã được thắp lại! Hãy thử thổi một lần nữa! 🕯️');
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
    
    // Open photo gallery
    openPhotoGallery();
    
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

// ===== SPARKLER EFFECT (PHÁO BÔNG) =====
function createSparklerEffect() {
    const colors = ['#ffd700', '#fff700', '#ffff00', '#ff8c00', '#ff4500'];
    
    // Left side sparklers
    createSideSparkler('left', colors);
    
    // Right side sparklers  
    createSideSparkler('right', colors);
}

function createSideSparkler(side, colors) {
    const startX = side === 'left' ? 0 : window.innerWidth;
    const endX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.7;
    
    // Create multiple sparkler particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparklerParticle(startX, startY, endX, colors, side);
        }, i * 50);
    }
}

function createSparklerParticle(startX, startY, endX, colors, side) {
    const particle = document.createElement('div');
    particle.className = 'sparkler-particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = side === 'left' ? (Math.random() * 60 + 15) : (Math.random() * 60 + 105);
    const distance = 200 + Math.random() * 300;
    
    const finalX = startX + Math.cos(angle * Math.PI / 180) * distance;
    const finalY = startY - Math.sin(angle * Math.PI / 180) * distance;
    
    particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 4px;
        height: 4px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        animation: sparklerFly 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        transform-origin: center;
    `;
    
    // Add sparkler animation if not exists
    if (!document.querySelector('#sparkler-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'sparkler-styles';
        styleSheet.textContent = `
            @keyframes sparklerFly {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                50% {
                    transform: translate(${(finalX - startX) * 0.7}px, ${(finalY - startY) * 0.7}px) scale(1.5);
                    opacity: 1;
                }
                100% {
                    transform: translate(${finalX - startX}px, ${finalY - startY}px) scale(0);
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
    }, 1500);
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
    
    // Also create melody using Web Audio API as backup
    playFullBirthdayMelody();
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
        
        // Full "Happy Birthday to You" melody
        const melody = [
            // "Happy birthday to you" (first line)
            { note: 264, duration: 0.75 }, // C4
            { note: 264, duration: 0.25 },
            { note: 297, duration: 1 },    // D4
            { note: 264, duration: 1 },    // C4
            { note: 352, duration: 1 },    // F4
            { note: 330, duration: 2 },    // E4
            
            // "Happy birthday to you" (second line)
            { note: 264, duration: 0.75 },
            { note: 264, duration: 0.25 },
            { note: 297, duration: 1 },
            { note: 264, duration: 1 },
            { note: 396, duration: 1 },    // G4
            { note: 352, duration: 2 },    // F4
            
            // "Happy birthday dear [name]" (third line)
            { note: 264, duration: 0.75 },
            { note: 264, duration: 0.25 },
            { note: 528, duration: 1 },    // C5
            { note: 440, duration: 1 },    // A4
            { note: 352, duration: 1 },    // F4
            { note: 330, duration: 1 },    // E4
            { note: 297, duration: 2 },    // D4
            
            // "Happy birthday to you" (final line)
            { note: 466, duration: 0.75 }, // Bb4
            { note: 466, duration: 0.25 },
            { note: 440, duration: 1 },    // A4
            { note: 352, duration: 1 },    // F4
            { note: 396, duration: 1 },    // G4
            { note: 352, duration: 3 },    // F4
        ];
        
        let currentTime = window.audioContext.currentTime;
        
        melody.forEach((note) => {
            if (musicPlaying) {
                playNote(note.note, currentTime, note.duration * 0.6);
                currentTime += note.duration * 0.6;
            }
        });
        
        // Loop the melody after a short pause
        if (musicPlaying) {
            const totalDuration = melody.reduce((sum, note) => sum + note.duration * 0.6, 0);
            currentMelodyTimeout = setTimeout(() => {
                if (musicPlaying) playFullBirthdayMelody();
            }, (totalDuration + 2) * 1000);
        }
    } catch (error) {
        console.log('Web Audio API not supported in this browser');
    }
}

function playNote(frequency, startTime, duration) {
    if (!window.audioContext) return;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
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
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playSparklerSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sparkler crackling sound
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(1000 + Math.random() * 2000, audioContext.currentTime);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, i * 100);
        }
    } catch (error) {
        console.log('Audio not supported');
    }
}

function playApplauseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create applause sound using noise
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const bufferSize = audioContext.sampleRate * 0.1;
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const output = buffer.getChannelData(0);
                
                for (let j = 0; j < bufferSize; j++) {
                    output[j] = Math.random() * 2 - 1;
                }
                
                const whiteNoise = audioContext.createBufferSource();
                whiteNoise.buffer = buffer;
                
                const bandpass = audioContext.createBiquadFilter();
                bandpass.type = 'bandpass';
                bandpass.frequency.value = 1000 + Math.random() * 500;
                
                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                whiteNoise.connect(bandpass);
                bandpass.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                whiteNoise.start(audioContext.currentTime);
                whiteNoise.stop(audioContext.currentTime + 0.1);
            }, i * 50 + Math.random() * 100);
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
        showMessage('📱 Mẹo: Chạm đa điểm để tạo bất ngờ! Chạm nến để thổi từng cái một!');
    }, 5000);
}