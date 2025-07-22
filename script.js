// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Initialize animation styles
    const elements = document.querySelectorAll('.service-card, .stat-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const trackButton = document.getElementById('track-button');
    if (trackButton) {
        trackButton.addEventListener('click', trackShipment);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .stat-item');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Contact form validation (for contact page)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#7CB342';
        }
    });

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#e74c3c';
            isValid = false;
        }
    }

    return isValid;
}

// Add loading state to buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Utility function for handling form submissions
function handleFormSubmission(form) {
    form.addEventListener('submit', function(e) {
        // Allow the default mailto: action to proceed
    });
}
// trackShipment function
// NEW: lightweight front-end tracker that pulls from a JSON file
async function trackShipment() {
    const id = document.getElementById('tracking-number').value.trim().toUpperCase();
    const resultsDiv = document.getElementById('tracking-results');

    // quick validation
    const re = /^[A-Z0-9]{8,16}$/;
    if (!re.test(id)) {
        resultsDiv.innerHTML = '<p style="color:#e74c3c">Tracking ID must be 8-16 alphanumeric characters.</p>';
        return;
    }

    // loading state
    resultsDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Searching…</p>';

    try {
        // 1. If you already have /api/track/:id endpoint, swap this URL
        // const res = await fetch(`/api/track/${id}`);
        // const data = await res.json();

        // 2. DEMO: load from a local JSON file (see step 3)
        const res = await fetch('./tracking-data.json');
        const db = await res.json();
        const data = db[id];

        if (data) {
            resultsDiv.innerHTML = `
                <div style="background:#fff;border-radius:8px;padding:1rem;box-shadow:0 2px 8px rgba(0,0,0,.1);text-align:left;">
                    <h3 style="margin:.2rem 0 .8rem;">${id}</h3>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p><strong>Estimated Delivery:</strong> ${data.eta}</p>
                </div>`;
        } else {
            resultsDiv.innerHTML = '<p style="color:#e74c3c">Shipment not found. Please check the ID and try again.</p>';
        }
    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = '<p style="color:#e74c3c">Unable to reach tracker at the moment. Try again shortly.</p>';
    }
}