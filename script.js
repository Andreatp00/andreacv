document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animations ---
    
    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left');
    
    // Create an Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to trigger CSS animation
                entry.target.classList.add('active');
                // Unobserve so it only animates once
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    // Observe all reveal elements
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Skill Bars Animation ---
    
    const skillFills = document.querySelectorAll('.skill-fill');
    
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the target width from data attribute
                const targetWidth = entry.target.getAttribute('data-width');
                // Apply width to trigger CSS transition
                entry.target.style.width = targetWidth;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillFills.forEach(fill => {
        // Initial state is 0% width (set in CSS)
        skillObserver.observe(fill);
    });
    
    // Initially trigger sidebar immediately if it's visible on load
    const sidebar = document.querySelector('.sidebar');
    if(sidebar) {
        setTimeout(() => {
            sidebar.classList.add('active');
        }, 100);
    }

    // --- 3D Hover Animations (Vanilla Tilt) ---
    // Inizializza l'effetto 3D sulle card dei progetti
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 8,             // Inclinazione massima
        speed: 400,         // Velocità dell'effetto
        glare: true,        // Effetto riflesso luce
        "max-glare": 0.2,   // Opacità massima del riflesso
        scale: 1.02,        // Zoom leggero al passaggio del mouse
        perspective: 1000
    });

    // Inizializza l'effetto 3D sulla foto profilo
    VanillaTilt.init(document.querySelector(".profile-img-wrapper"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.4,
        scale: 1.05
    });
});
