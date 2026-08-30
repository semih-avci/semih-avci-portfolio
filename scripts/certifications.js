document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cursorGlow = document.getElementById('cursorGlow');
    if (!reducedMotion && cursorGlow) {
        document.addEventListener('mousemove', (event) => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        });
    }

    document.querySelectorAll('.ripple-btn').forEach((button) => {
        button.addEventListener('click', function (event) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            ripple.className = 'ripple';
            this.appendChild(ripple);
            window.setTimeout(() => ripple.remove(), 600);
        });
    });

    const revealElements = document.querySelectorAll('.reveal-card');
    if ('IntersectionObserver' in window && !reducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    const canvas = document.getElementById('gold-particles');
    if (!canvas || reducedMotion) return;

    const context = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array.from(
            { length: Math.floor((canvas.width * canvas.height) / 18000) },
            () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.4 + 0.2,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * -0.7 - 0.15,
                alpha: Math.random() * 0.45 + 0.15
            })
        );
    };

    const animateParticles = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            if (particle.y < -2) {
                particle.y = canvas.height + 2;
                particle.x = Math.random() * canvas.width;
            }
            context.beginPath();
            context.fillStyle = `rgba(212, 175, 55, ${particle.alpha})`;
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fill();
        });
        window.requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
});
