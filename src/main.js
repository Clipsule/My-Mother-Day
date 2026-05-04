document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Image Preloading Strategy
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    function preloadUpcomingImages() {
        const albumImages = document.querySelectorAll('.album-cell img[data-src]');
        const lazyImages = Array.from(albumImages).slice(0, 4);
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                preloadImage(img.dataset.src).catch(() => {});
            }
        });
    }
    
    // Lazy Loading with IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserverOptions = {
        root: null,
        rootMargin: '100px 0px',
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    
                    img.onload = function() {
                        img.classList.add('loaded');
                        const skeleton = img.previousElementSibling;
                        if (skeleton && skeleton.classList.contains('skeleton')) {
                            skeleton.style.display = 'none';
                        }
                    };
                }
                imageObserver.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Trigger preload for first batch of images
    setTimeout(preloadUpcomingImages, 500);
    
    // Fade In Animation with optimized IntersectionObserver
    const fadeInElements = document.querySelectorAll('.fi');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('fi-vis')) {
                entry.target.classList.add('fi-vis');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeInElements.forEach(el => observer.observe(el));
    
    // Parallax Scrolling Effect
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    function updateParallax() {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
            const speed = 0.5;
            const yPos = scrollY * speed;
            el.style.transform = `translateY(${yPos}px) translateZ(0)`;
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    
    if (menuBtn && drawerOverlay) {
        menuBtn.addEventListener('click', function() {
            drawerOverlay.classList.toggle('active');
        });
        
        drawerOverlay.addEventListener('click', function(e) {
            if (e.target === drawerOverlay) {
                drawerOverlay.classList.remove('active');
            }
        });
    }
    
    // Smooth Scroll
    const scrollButtons = document.querySelectorAll('[data-target]');
    scrollButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close drawer if open
                if (drawerOverlay) {
                    drawerOverlay.classList.remove('active');
                }
            }
        });
    });
    
    // Music Button Toggle
    const musicBtnMobile = document.getElementById('musicBtnMobile');
    const musicBtnDesktop = document.getElementById('musicBtnDesktop');
    const bgMusic = document.getElementById('bgMusic');
    
    let musicOn = true; // 默认播放
    
    // 更新图标显示，根据 musicOn 状态
    function updateMusicIcons() {
        const playIcons = document.querySelectorAll('.music-play');
        const muteIcons = document.querySelectorAll('.music-mute');
        
        if (musicOn) {
            // 显示音乐图标
            playIcons.forEach(icon => {
                icon.style.display = 'block';
                setTimeout(() => {
                    icon.style.opacity = '1';
                    icon.style.transform = 'scale(1)';
                }, 50);
            });
            
            muteIcons.forEach(icon => {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    icon.style.display = 'none';
                }, 300);
            });
        } else {
            // 显示静音图标
            muteIcons.forEach(icon => {
                icon.style.display = 'block';
                setTimeout(() => {
                    icon.style.opacity = '1';
                    icon.style.transform = 'scale(1)';
                }, 50);
            });
            
            playIcons.forEach(icon => {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    icon.style.display = 'none';
                }, 300);
            });
        }
    }
    
    function toggleMusic() {
        musicOn = !musicOn;
        
        if (musicOn) {
            // Play music
            if (bgMusic) {
                bgMusic.play().catch(() => {
                    musicOn = false;
                    updateMusicIcons();
                });
            }
        } else {
            // Pause music
            if (bgMusic) {
                bgMusic.pause();
            }
        }
        
        updateMusicIcons();
    }
    
    // Try to play music on page load
    function initializeMusic() {
        // 先初始化图标
        const playIcons = document.querySelectorAll('.music-play');
        const muteIcons = document.querySelectorAll('.music-mute');
        
        playIcons.forEach(icon => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
            icon.style.display = 'block';
        });
        
        muteIcons.forEach(icon => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0.8)';
            icon.style.display = 'none';
        });
        
        // 尝试播放
        if (bgMusic) {
            bgMusic.play().catch(() => {
                // 自动播放被阻止，但保持 musicOn = true，用户点击时再处理
            });
        }
    }
    
    initializeMusic();
    
    if (musicBtnMobile) {
        musicBtnMobile.addEventListener('click', toggleMusic);
    }
    
    if (musicBtnDesktop) {
        musicBtnDesktop.addEventListener('click', toggleMusic);
    }
    
    // Like Button
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    const likeBtnMobile = document.getElementById('likeBtnMobile');
    const likeCountMobile = document.getElementById('likeCountMobile');
    
    let liked = false;
    let likes = 1234;
    
    function handleLike(btn, countEl) {
        if (!liked) {
            liked = true;
            likes++;
            
            if (btn) btn.classList.add('liked');
            if (countEl) countEl.textContent = likes;
            
            if (likeBtn && likeBtn !== btn) {
                likeBtn.classList.add('liked');
                likeCount.textContent = likes;
            }
            
            if (likeBtnMobile && likeBtnMobile !== btn) {
                likeBtnMobile.classList.add('liked');
                likeCountMobile.textContent = likes;
            }
        }
    }
    
    if (likeBtn) {
        likeBtn.addEventListener('click', () => handleLike(likeBtn, likeCount));
    }
    
    if (likeBtnMobile) {
        likeBtnMobile.addEventListener('click', () => handleLike(likeBtnMobile, likeCountMobile));
    }
    
    // Album Tabs
    const albumTabs = document.querySelectorAll('.album-tab');
    const albumCells = document.querySelectorAll('.album-cell');
    
    albumTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-tab');
            albumTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            albumCells.forEach(cell => {
                const cellCat = cell.getAttribute('data-cat');
                if (category === '全部' || cellCat === category) {
                    cell.style.display = 'block';
                } else {
                    cell.style.display = 'none';
                }
            });
        });
    });
    
    // Heart Button Interaction
    const heartButton = document.getElementById('heartBtn');
    const heartMessage = document.getElementById('heartMsg');
    const heartWrapper = document.getElementById('heartWrapper');
    
    const messages = [
        '母亲节快乐！❤️ 我爱您！',
        '妈妈我爱你！💕',
        '您辛苦了！🌹',
        '永远年轻美丽！✨',
        '每天开心！😊',
        '健康快乐！🌷'
    ];
    
    let heartClicked = false;
    let messageIndex = 0;
    
    if (heartButton) {
        heartButton.addEventListener('click', function() {
            if (!heartClicked) {
                heartClicked = true;
                heartButton.classList.add('clicked');
                heartButton.classList.remove('heart-bounce');
                void heartButton.offsetWidth;
                heartButton.classList.add('heart-bounce');
                
                // Create ripple rings with GPU acceleration
                if (heartWrapper) {
                    const ring1 = document.createElement('div');
                    ring1.className = 'rpl-ring';
                    ring1.style.cssText = 'width:150px; height:150px; top:-8px; left:-8px; animation-delay:0s; transform:translateZ(0)';
                    heartWrapper.appendChild(ring1);
                    
                    const ring2 = document.createElement('div');
                    ring2.className = 'rpl-ring';
                    ring2.style.cssText = 'width:150px; height:150px; top:-8px; left:-8px; animation-delay:0.6s; transform:translateZ(0)';
                    heartWrapper.appendChild(ring2);
                    
                    const ring3 = document.createElement('div');
                    ring3.className = 'rpl-ring';
                    ring3.style.cssText = 'width:150px; height:150px; top:-8px; left:-8px; animation-delay:1.2s; transform:translateZ(0)';
                    heartWrapper.appendChild(ring3);
                    
                    setTimeout(() => {
                        ring1.remove();
                        ring2.remove();
                        ring3.remove();
                    }, 2800);
                }
                
                // Show message with pop-in animation
                if (heartMessage) {
                    heartMessage.textContent = messages[messageIndex];
                    heartMessage.style.display = 'inline-block';
                    heartMessage.classList.remove('show', 'msg-pop');
                    void heartMessage.offsetWidth;
                    heartMessage.classList.add('show', 'msg-pop');
                    messageIndex = (messageIndex + 1) % messages.length;
                    
                    setTimeout(() => {
                        heartMessage.classList.remove('show', 'msg-pop');
                    }, 3500);
                }
                
                setTimeout(() => {
                    heartButton.classList.remove('clicked', 'heart-bounce');
                    heartClicked = false;
                }, 700);
            }
        });
    }
    
    console.log('Mother\'s Day website loaded! 🌸');
    
    // Envelope Open Animation
    const envelopeContainer = document.getElementById('envelopeContainer');
    const envelopeHint = document.querySelector('.envelope-hint');
    
    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', function() {
            if (!envelopeContainer.classList.contains('opened')) {
                envelopeContainer.classList.add('opened');
                
                if (envelopeHint) {
                    envelopeHint.style.opacity = '0';
                    envelopeHint.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        envelopeHint.textContent = '💌 信纸已展开';
                        envelopeHint.style.opacity = '0.8';
                    }, 1500);
                }
                
                setTimeout(() => {
                    const shareBtn = document.getElementById('shareBtn');
                    if (shareBtn) {
                        shareBtn.classList.add('shimmer-effect');
                    }
                }, 1800);
            }
        });
    }
    
    // Share Button Click Handler
    const shareBtn = document.getElementById('shareBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareBtn.classList.remove('shimmer-effect');
            
            const shareMessages = [
                '祝妈妈母亲节快乐！❤️',
                '妈妈，我爱您！💕',
                '感谢妈妈一直以来的付出！🌹',
                '母亲节快乐！愿您永远健康美丽！✨'
            ];
            
            if (navigator.share) {
                navigator.share({
                    title: '母亲节快乐',
                    text: shareMessages[Math.floor(Math.random() * shareMessages.length)],
                    url: window.location.href
                }).catch(() => {});
            } else {
                const dummy = document.createElement('input');
                dummy.value = window.location.href;
                document.body.appendChild(dummy);
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                
                shareBtn.textContent = '已复制链接 ✓';
                shareBtn.style.background = 'var(--rose)';
                shareBtn.style.color = 'white';
                
                setTimeout(() => {
                    shareBtn.textContent = '分享给妈妈';
                    shareBtn.style.background = '';
                    shareBtn.style.color = '';
                }, 2000);
            }
        });
    }
});
