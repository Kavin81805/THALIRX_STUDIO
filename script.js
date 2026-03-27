// Check if device is mobile/touch
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Preloader & Page Load Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
    document.body.classList.add('loaded');
});

// Throttled Scroll Logic
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

function handleScroll() {
    const winScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / docHeight) * 100;

    // Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) progressBar.style.width = scrolled + '%';

    // Back to Top Button
    const topBtn = document.getElementById("backToTop");
    if (topBtn) {
        topBtn.style.display = winScroll > 500 ? "block" : "none";
    }

    // Parallax Effects
    const parallaxItems = document.querySelectorAll('.hero-bg-video, .project-header');
    parallaxItems.forEach(item => {
        let speed = 0.5;
        if (item.classList.contains('hero-bg-video')) {
            item.style.transform = `translateX(-50%) translateY(calc(-50% + ${winScroll * speed}px))`;
        } else {
            item.style.transform = `translateY(${winScroll * speed}px)`;
        }
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (winScroll > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
}
// Mobile Menu Toggle Logic
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Back to Top Click
const topBtn = document.getElementById("backToTop");
if (topBtn) {
    topBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
}

// Custom Cursor Logic (Disable on mobile)
const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursor-blur");

if (!isMobile && cursor && cursorBlur) {
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

        // Use requestAnimationFrame for smoother blur follow
        window.requestAnimationFrame(() => {
            cursorBlur.style.left = e.clientX + "px";
            cursorBlur.style.top = e.clientY + "px";
        });
    });
} else {
    // Hide cursor elements on mobile
    if (cursor) cursor.style.display = 'none';
    if (cursorBlur) cursorBlur.style.display = 'none';
}

// 3D Tilt Effect
function applyTilt(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
}

document.querySelectorAll('.founder-card, .service-card, .vision-mission-stack, .stat-item, .project-card, .project-info-card, .featured-image-container, .discord-card, .portfolio-logo-card').forEach(applyTilt);

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            fadeUpObserver.unobserve(entry.target);

            if (entry.target.classList.contains('vision-mission-stack') || entry.target.classList.contains('project-info-card')) {
                const counterContainer = entry.target.querySelector('#clientCounter, #employeeCounter');
                if (!counterContainer || counterContainer.classList.contains('animated')) return;

                counterContainer.classList.add('animated');
                const targetStr = counterContainer.getAttribute('data-target').toString();
                const digits = targetStr.split('');

                counterContainer.innerHTML = '';

                digits.forEach((digit, index) => {
                    const column = document.createElement('div');
                    column.className = 'digit-column';
                    let numbersHtml = '<div class="digit">0</div>';

                    for (let i = 1; i < 15; i++) {
                        numbersHtml += `<div class="digit">${Math.floor(Math.random() * 10)}</div>`;
                    }
                    numbersHtml += `<div class="digit">${digit}</div>`;

                    column.innerHTML = numbersHtml;
                    counterContainer.appendChild(column);

                    setTimeout(() => {
                        const firstDigit = column.querySelector('.digit');
                        const h = firstDigit.getBoundingClientRect().height;
                        const remHeight = h / parseFloat(getComputedStyle(document.documentElement).fontSize);
                        column.style.transform = `translateY(-${15 * remHeight}rem)`;
                    }, 100);
                });

                const plusSign = document.createElement('div');
                plusSign.className = 'plus-symbol';
                plusSign.innerText = '+';
                counterContainer.appendChild(plusSign);
            }
        }
    });
}, observerOptions);

function observeElements(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        fadeUpObserver.observe(el);
    });
}

// Individual Counter Animation Logic
function animateSingleCounter(stat) {
    if (stat.classList.contains('animated')) return;
    stat.classList.add('animated');

    const target = +stat.getAttribute('data-target');
    const duration = 2000; // 2 seconds exactly
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentCount = Math.floor(easedProgress * target);
        // Only add '+' for values like 5 or 47, not for 1 or 2025
        const showPlus = (target >= 5 && target !== 2025);
        stat.innerText = currentCount + (showPlus ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            stat.innerText = target + (showPlus ? '+' : '');
        }
    }

    requestAnimationFrame(update);
}

// Update Observer for Stats
function observeStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSingleCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => observer.observe(stat));
}

document.addEventListener('DOMContentLoaded', () => {
    observeStats();
    loadGalleryImages();
});

observeElements('.section-title, .about-text, .vision-mission-stack, .divider-line, .stat, .glass-panel, .founder-card, .service-card, .project-card, .project-info-card, .featured-image-container, .community-text, .discord-card, .community-slogan, .stat-item');

// Dynamic Gallery Loader
function loadGalleryImages() {
    const galleryGrid = document.getElementById('dynamicGallery');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = ''; // Clear existing
    let loadedCount = 0;
    const maxImages = 14;

    for (let i = 1; i <= maxImages; i++) {
        const imgSrc = `assets/project1/${i}.jpeg`;
        const imgObj = new Image();

        imgObj.onload = function () {
            const item = document.createElement('div');
            item.className = 'gallery-item glass-panel';
            item.setAttribute('data-tilt', '');

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Project 1 Screenshot ${i}`;

            item.appendChild(img);
            galleryGrid.appendChild(item);

            // Re-apply tilt effect to the new element
            if (typeof applyTilt === 'function') applyTilt(item);

            loadedCount++;
            // Re-initialize lightbox and scroll animations as images load
            setupLightbox();
            observeElements('.gallery-item');
        };

        imgObj.src = imgSrc;
    }
}

// Lightbox Gallery Logic
const modal = document.getElementById("galleryModal");
const modalImg = document.getElementById("modalImg");
const captionText = document.getElementById("modalCaption");
let currentImages = [];
let currentImageIndex = 0;

function setupLightbox() {
    const images = document.querySelectorAll(".gallery-item img, .featured-image");
    currentImages = Array.from(images);

    currentImages.forEach((img, index) => {
        img.removeEventListener("click", () => openLightbox(index));
        img.onclick = () => openLightbox(index);
    });
}

function openLightbox(index) {
    if (!modal) return;
    currentImageIndex = index;
    updateModalImage();
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function updateModalImage() {
    const img = currentImages[currentImageIndex];
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateModalImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateModalImage();
}

if (modal) {
    const closeBtn = document.querySelector(".modal-close");
    const nextBtn = document.querySelector(".modal-nav.next");
    const prevBtn = document.querySelector(".modal-nav.prev");

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); nextImage(); };
    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); prevImage(); };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "block") {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }
    });
}

setupLightbox();
