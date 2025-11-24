document.addEventListener('DOMContentLoaded', () => {
    hidePreloader();
    initNavbar();
    initHeroCanvas();
    initScrollAnimations();
    initStatCounters();
    initPortfolio();
    initTestimonials();
    initFAQ();
    initContactForm();
    initScrollToTop();
});

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 2500);
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;
    const colors = ['#00a3c4', '#FFDF00', '#1a365d'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) {
                this.speedX *= -1;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY *= -1;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawAfricanPattern() {
        ctx.strokeStyle = '#d4af37';
        ctx.globalAlpha = 0.05;
        ctx.lineWidth = 2;

        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 100 + 50;

            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI * 2 * j) / 6;
                const px = x + Math.cos(angle) * size;
                const py = y + Math.sin(angle) * size;
                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = '#00a3c4';
                    ctx.globalAlpha = (150 - distance) / 150 * 0.2;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    let patternDrawn = false;

    function animate() {
        ctx.fillStyle = 'rgba(26, 54, 93, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!patternDrawn) {
            drawAfricanPattern();
            patternDrawn = true;
        }

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        patternDrawn = false;
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

function initPortfolio() {
    const cards = Array.from(document.querySelectorAll('.portfolio-card'));
    if (!cards.length) return;

    cards.forEach(card => {
        const toggle = card.querySelector('.portfolio-toggle');
        const details = card.querySelector('.portfolio-details');
        const closeBtn = card.querySelector('.close-portfolio');

        function openCard() {
            cards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('open');
                    c.setAttribute('aria-expanded', 'false');
                    const d = c.querySelector('.portfolio-details');
                    if (d) d.setAttribute('aria-hidden', 'true');
                    const t = c.querySelector('.portfolio-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });
            card.classList.add('open');
            card.setAttribute('aria-expanded', 'true');
            if (details) details.setAttribute('aria-hidden', 'false');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function closeCard() {
            card.classList.remove('open');
            card.setAttribute('aria-expanded', 'false');
            if (details) details.setAttribute('aria-hidden', 'true');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (card.classList.contains('open')) closeCard();
                else openCard();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeCard();
            });
        }

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (card.classList.contains('open')) closeCard();
                else openCard();
            }
            if (e.key === 'Escape') closeCard();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.portfolio-card')) {
            cards.forEach(c => {
                c.classList.remove('open');
                c.setAttribute('aria-expanded', 'false');
                const d = c.querySelector('.portfolio-details');
                if (d) d.setAttribute('aria-hidden', 'true');
                const t = c.querySelector('.portfolio-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');

        currentIndex = index;

        slides[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');

        resetAutoplay();
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }

    startAutoplay();
}

function initFAQ() {
    const items = document.querySelectorAll('[data-faq]');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const ans = item.querySelector('.faq-answer');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            ans.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            if (isOpen) {
                ans.style.maxHeight = ans.scrollHeight + 24 + "px";
            } else {
                ans.style.maxHeight = null;
            }
        });
        window.addEventListener('resize', () => {
            if (item.classList.contains('open')) {
                ans.style.maxHeight = ans.scrollHeight + 24 + "px";
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Message Sent Successfully!';
            form.reset();

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        }, 1500);
    });
}

function initScrollToTop() {
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.id = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
      <i class="fas fa-chevron-up"></i>
      <div class="progress-bar"></div>
    `;
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #f59e0b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--navy);
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    const progressBar = scrollToTopBtn.querySelector('.progress-bar');
    progressBar.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background: linear-gradient(to top, var(--navy), transparent);
        border-radius: 50%;
        transition: height 0.1s ease;
    `;

    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = (scrollPosition / (scrollHeight - clientHeight)) * 100;

        const show = scrollPosition > 2000;
        scrollToTopBtn.style.opacity = show ? '1' : '0';
        scrollToTopBtn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';

        progressBar.style.height = `${scrollPercentage}%`;
    });
}