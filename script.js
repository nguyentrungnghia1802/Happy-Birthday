// ===== GLOBAL VARIABLES =====
let candlesBlownOut = 0;
let musicPlaying = false;
let wishIndex = 0;
const totalCandles = 5;

// ===== DOM ELEMENTS =====
const blowButton = document.getElementById('blowButton');
const surpriseButton = document.getElementById('surpriseButton');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const confettiContainer = document.getElementById('confetti-container');
const fireworksContainer = document.getElementById('fireworks-container');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWishRotation();
    initializeEventListeners();
    createBackgroundAnimations();
    playIntroAnimation();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    blowButton.addEventListener('click', blowCandles);
    surpriseButton.addEventListener('click', triggerSurprise);
    musicToggle.addEventListener('click', toggleMusic);
    
    // Add click handlers for individual candles
    document.querySelectorAll('.candle').forEach((candle, index) => {
        candle.addEventListener('click', () => blowSingleCandle(index));
    });
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyPress);
    
    // Auto-play intro after 3 seconds
    setTimeout(() => {
        if (!musicPlaying) {
            toggleMusic();
        }
    }, 3000);
}

// ===== CANDLE BLOWING FUNCTIONALITY =====
function blowCandles() {
    blowButton.classList.add('active');
    
    // Blow out all remaining candles
    document.querySelectorAll('.flame:not(.blown-out)').forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('blown-out');
            candlesBlownOut++;
            
            // Create smoke effect
            createSmokeEffect(flame);
            
            // Play blow sound
            playBlowSound();
            
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
        
        createSmokeEffect(flame);
        playBlowSound();
        
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
    const smokeKeyframes = `
        @keyframes smokeRise {
            0% { opacity: 0.7; transform: translateX(-50%) translateY(0) scale(1); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(2); }
        }
    `;
    
    if (!document.querySelector('#smoke-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'smoke-styles';
        styleSheet.textContent = smokeKeyframes;
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
    
    // Multiple surprise effects
    createConfettiExplosion(30);
    createFireworks();
    triggerBalloonDance();
    showSurpriseMessage();
    playCelebrationSound();
    
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
        left: ${x}px;
        background-color: ${color};
        transform: rotate(${rotation}deg) scale(${scale});
        animation-duration: ${2 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
    `;
    
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
            left: ${x}px;
            top: ${y}px;
            background-color: ${color};
            animation: firework-explosion 1s ease-out forwards;
            transform: translate(${deltaX}px, ${deltaY}px);
            box-shadow: 0 0 10px ${color};
        `;
        
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
    musicIcon.textContent = '🎵';
    musicText.textContent = 'Tắt Nhạc';
    musicToggle.style.background = 'rgba(255, 255, 255, 0.3)';
    
    // Create simple melody using Web Audio API
    playBirthdayMelody();
}

function stopMusic() {
    musicPlaying = false;
    musicIcon.textContent = '🔇';
    musicText.textContent = 'Bật Nhạc';
    musicToggle.style.background = 'rgba(255, 255, 255, 0.2)';
    
    // Stop any playing audio
    if (window.audioContext) {
        window.audioContext.close();
        window.audioContext = null;
    }
}

function playBirthdayMelody() {
    try {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const melody = [
            { note: 262, duration: 0.5 }, // C
            { note: 262, duration: 0.5 }, // C
            { note: 294, duration: 1 },   // D
            { note: 262, duration: 1 },   // C
            { note: 349, duration: 1 },   // F
            { note: 330, duration: 2 },   // E
        ];
        
        let currentTime = window.audioContext.currentTime;
        
        melody.forEach((note, index) => {
            if (musicPlaying) {
                playNote(note.note, currentTime, note.duration);
                currentTime += note.duration;
            }
        });
        
        // Loop the melody
        if (musicPlaying) {
            setTimeout(() => {
                if (musicPlaying) playBirthdayMelody();
            }, currentTime * 1000);
        }
    } catch (error) {
        console.log('Audio not supported in this browser');
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
function playBlowSound() {
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

function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play a cheerful chord
        const frequencies = [523, 659, 784]; // C, E, G
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + 1 + index * 0.1);
        });
    } catch (error) {
        console.log('Audio not supported');
    }
}

// ===== WISH ROTATION =====
function initializeWishRotation() {
    const wishes = document.querySelectorAll('.wish');
    
    setInterval(() => {
        wishes[wishIndex].classList.remove('active');
        wishIndex = (wishIndex + 1) % wishes.length;
        wishes[wishIndex].classList.add('active');
    }, 3000);
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