// XYZ Agency - Bright Futuristic JavaScript Interactivity

// Mobile Menu Toggle
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

let navClose = document.querySelector('.nav-close');
if (navMenu && !navClose) {
    navClose = document.createElement('button');
    navClose.type = 'button';
    navClose.className = 'nav-close';
    navClose.setAttribute('aria-label', 'Close menu');
    navClose.innerHTML = '&times;';
    navMenu.parentElement.insertBefore(navClose, navMenu.nextSibling);
}

const navBrand = document.querySelector('.nav-brand');
if (navBrand && !navBrand.querySelector('.brand-tagline')) {
    const tagline = document.createElement('span');
    tagline.className = 'brand-tagline';
    tagline.textContent = 'Creative Technology Studio';
    navBrand.appendChild(tagline);
}

const toggleNavState = (isOpen) => {
    if (!navMenu || !hamburger) return;
    navMenu.classList.toggle('active', isOpen);
    hamburger.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    if (navClose) {
        navClose.classList.toggle('visible', isOpen);
    }
    if (navBrand) {
        navBrand.classList.toggle('nav-brand-active', isOpen);
    }
};

if (hamburger && navMenu) {
    const toggleNav = () => {
        const isOpen = !navMenu.classList.contains('active');
        toggleNavState(isOpen);
    };

    hamburger.addEventListener('click', toggleNav);
    if (navClose) {
        navClose.addEventListener('click', () => toggleNavState(false));
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleNavState(false);
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - Bright effect
if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }
    });
}

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--accent-blue)';
            }
        }
    });
});

// Animate statistics on scroll
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
};

const animateNumber = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
};

// Initialize stats animation
animateStats();

// Fade-in animations on scroll
const fadeInElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(element => {
    fadeInObserver.observe(element);
});

// Animate service cards on scroll
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    serviceObserver.observe(card);
});

// Animate portfolio items on scroll
const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
            portfolioObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

portfolioCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    portfolioObserver.observe(card);
    const link = card.querySelector('.portfolio-card-link');
    if (link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (event) => {
            if (!(event.target instanceof HTMLAnchorElement)) {
                link.click();
            }
        });
    }
});

// Animate tech badges on scroll
const techBadges = document.querySelectorAll('.tech-badge');
const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 20);
            techObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

techBadges.forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.8)';
    badge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    techObserver.observe(badge);
});

// Animate tech progress bars
const techProgressBars = document.querySelectorAll('.tech-progress-bar');
const techProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const span = bar.querySelector('span');
            const progress = bar.getAttribute('data-progress') || '0';
            bar.style.setProperty('--progress', `${progress}%`);
            bar.classList.add('is-visible');
            if (span) {
                span.style.width = `${progress}%`;
            }
            techProgressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

techProgressBars.forEach(bar => {
    const span = bar.querySelector('span');
    if (span) {
        span.style.width = '0%';
    }
    techProgressObserver.observe(bar);
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = heroSection.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });
}

// Smooth reveal animations for testimonials
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            testimonialObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

testimonialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    testimonialObserver.observe(card);
});

// Add cursor effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, .tech-badge');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });
    element.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});

// Scroll to top on page load (smooth entrance)
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Console message for developers
console.log('%cXYZ Agency', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cEngineering Intelligent Digital Solutions', 'font-size: 14px; color: #64748b;');
console.log('%cReady to build something amazing?', 'font-size: 12px; color: #94a3b8;');
