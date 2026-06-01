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

    // --- 3D Flutter Scroll Animations ---
    const flutterElements = document.querySelectorAll('.flutter-3d');
    
    // Add smooth transition to elements
    flutterElements.forEach(el => {
        el.style.transition = 'transform 0.15s cubic-bezier(0.1, 0.5, 0.1, 1)';
    });

    const applyFlutter3D = () => {
        const windowCenter = window.innerHeight / 2;
        
        flutterElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Ignore elements far out of viewport to save performance
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            
            const elCenter = rect.top + rect.height / 2;
            // Calculate distance from center of viewport (-1 to 1)
            let dist = (elCenter - windowCenter) / (window.innerHeight / 2);
            
            // Clamp dist between -1 and 1 just in case
            dist = Math.max(-1, Math.min(1, dist));
            
            // Calculate tilt (max 18 degrees)
            const tiltX = dist * 18;
            
            // Apply 3D transform: perspective + rotation + slight scale
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) scale(1.02)`;
        });
    };

    // Apply on scroll and initial load
    window.addEventListener('scroll', applyFlutter3D, { passive: true });
    applyFlutter3D();
});
