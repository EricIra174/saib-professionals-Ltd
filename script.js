document.addEventListener('DOMContentLoaded', () => {
    // Utility Functions
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.innerHTML = value + (element.innerText.includes('+') ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };

    // Form Validation
    const validateForm = (data) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        
        if (!data.name || data.name.length < 2) {
            showNotification('Please enter a valid name', 'error');
            return false;
        }
        
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (data.phone && !phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }
        
        if (!data.course) {
            showNotification('Please select a course', 'error');
            return false;
        }
        
        if (!data.message || data.message.length < 10) {
            showNotification('Please enter a message (minimum 10 characters)', 'error');
            return false;
        }
        
        return true;
    };

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Animate stats when they come into view
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const value = stat.innerText;
            if (!stat.dataset.animated && isInViewport(stat)) {
                animateValue(stat, 0, parseInt(value), 2000);
                stat.dataset.animated = true;
            }
        });
    };

    // Animate course cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach((card, index) => {
            if (isInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s forwards`;
            }
        });
        animateStats();
    };

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for elements in viewport
    animateOnScroll();

    // Search functionality with autocomplete
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    const courses = [
        'Food Safety Fundamentals',
        'Hazard Control & Prevention',
        'Food Handling & Hygiene',
        'Fire Safety Fundamentals',
        'Fire Prevention & Response',
        'Practical Fire Safety',
        'Basic First Aid',
        'Emergency Response',
        'Advanced First Aid'
    ];

    searchInput?.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const filteredCourses = courses.filter(course => 
            course.toLowerCase().includes(value)
        );
        
        // Here you can implement autocomplete dropdown
        console.log('Matching courses:', filteredCourses);
    });

    searchBtn?.addEventListener('click', () => {
        const searchTerm = searchInput?.value.trim().toLowerCase();
        if (searchTerm) {
            // Implement search functionality
            console.log('Searching for:', searchTerm);
        }
    });

    // Allow search on Enter key
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn?.click();
        }
    });

    // Contact Form Handling
    const contactForm = document.querySelector('#contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!validateForm(formDataObj)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Clear form
                contactForm.reset();
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Newsletter Subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            try {
                // Simulate API call (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Clear form
                newsletterForm.reset();
                
                // Show success message
                showNotification('Successfully subscribed to our newsletter!', 'success');
            } catch (error) {
                showNotification('Failed to subscribe. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Certificate Modal
    const certShowcase = document.querySelector('.cert-showcase');
    const body = document.body;

    if (certShowcase) {
        certShowcase.addEventListener('click', () => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'cert-modal';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'cert-modal-content';
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'cert-modal-close';
            closeBtn.innerHTML = '&times;';
            
            // Create image
            const img = document.createElement('img');
            img.src = 'images/SAIB-CERTIFICATE.png';
            img.alt = 'SAIB Professional Certificate';
            
            // Append elements
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(img);
            modal.appendChild(modalContent);
            body.appendChild(modal);
            
            // Prevent body scroll
            body.style.overflow = 'hidden';
            
            // Add animation class
            setTimeout(() => modal.classList.add('active'), 10);
            
            // Close modal function
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    body.style.overflow = '';
                }, 300);
            };
            
            // Close on button click
            closeBtn.addEventListener('click', closeModal);
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        });
    }

    // Scroll Progress Indicator
    const createScrollProgress = () => {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-progress';
        document.body.appendChild(indicator);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            indicator.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    };

    // Intersection Observer for Animations
    const createIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        // Observe elements
        document.querySelectorAll('.vm-card, .info-card, .stat-item, .about-text h3, .about-text p')
            .forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
    };

    // Enhanced Mobile Menu
    const setupMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                if (navMenu.classList.contains('active')) {
                    navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
                } else {
                    navMenu.style.maxHeight = '0';
                }
            });
        }
    };

    // Initialize all features
    createScrollProgress();
    createIntersectionObserver();
    setupMobileMenu();
    
    // Initial check for animations
    animateStats();
    animateOnScroll();

    // Contact Form Validation and Submission
    function handleSubmit(event) {
        event.preventDefault();
        
        // Reset previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
        
        const formStatus = document.getElementById('formStatus');
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const course = document.getElementById('course');
        const message = document.getElementById('message');
        
        // Validate name
        if (name.value.trim().length < 2) {
            showError('nameError', 'Please enter a valid name');
            return false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        // Validate phone (optional)
        if (phone.value) {
            const phoneRegex = /^[0-9+\s-]{10,}$/;
            if (!phoneRegex.test(phone.value)) {
                showError('phoneError', 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Validate course selection
        if (!course.value) {
            showError('courseError', 'Please select a course');
            return false;
        }
        
        // Validate message
        if (message.value.trim().length < 10) {
            showError('messageError', 'Please enter a message (minimum 10 characters)');
            return false;
        }
        
        // Simulate form submission
        const submitButton = event.target.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const originalText = buttonText.textContent;
        
        submitButton.disabled = true;
        buttonText.textContent = 'Sending...';
        
        // Simulate API call
        setTimeout(() => {
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            event.target.reset();
            
            submitButton.disabled = false;
            buttonText.textContent = originalText;
        }, 1500);
        
        return false;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function showFormStatus(type, message) {
        const formStatus = document.getElementById('formStatus');
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
    }

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Initially hide all answers
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current answer
            answer.style.display = isOpen ? 'none' : 'block';
            item.classList.toggle('active', !isOpen);
        });
    });

    // Track link clicks
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`Link clicked: ${link.href}`);
        });
    });
});
