$(document).ready(function() {
    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.nav-links').removeClass('active');
            $('.menu-toggle').removeClass('active');
        }
    });

    // Testimonials Carousel with Swiper
    let swiperInstance;
    let autoAdvanceInterval;
    let isUserOnTestimonials = false;

    // Initialize Swiper
    swiperInstance = new Swiper('.testimonial-swiper', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 500,
        autoHeight: true,
        watchOverflow: true,
        allowTouchMove: false,
        loop: true,
        navigation: {
            nextEl: '.carousel-btn-right',
            prevEl: '.carousel-btn-left',
        },
        on: {
            slideChangeTransitionStart: function() {
                this.updateAutoHeight();
            },
            slideChangeTransitionEnd: function() {
                this.updateAutoHeight();
            }
        }
    });

    // Auto-advance function
    function startAutoAdvance() {
        if (isUserOnTestimonials) {
            autoAdvanceInterval = setInterval(function() {
                swiperInstance.slideNext();
            }, 5000); // Advance every 5 seconds
        }
    }

    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }

    function resetAutoAdvance() {
        stopAutoAdvance();
        if (isUserOnTestimonials) {
            startAutoAdvance();
        }
    }

    // Reset auto-advance when user manually navigates
    swiperInstance.on('slideChange', function() {
        resetAutoAdvance();
    });

    // Check if testimonials section is in view
    function checkTestimonialsInView() {
        const testimonialsSection = $('.testimonials-section');
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        const sectionTop = testimonialsSection.offset().top;
        const sectionHeight = testimonialsSection.outerHeight();
        
        // Check if user has scrolled past halfway through the section
        const sectionMidpoint = sectionTop + (sectionHeight / 2);
        const viewportBottom = scrollTop + windowHeight;
        
        // User is "on" the section if they haven't scrolled past the midpoint
        const wasOnSection = isUserOnTestimonials;
        isUserOnTestimonials = (scrollTop < sectionMidpoint) && (viewportBottom > sectionTop);
        
        // Start or stop auto-advance based on visibility
        if (isUserOnTestimonials && !wasOnSection) {
            startAutoAdvance();
        } else if (!isUserOnTestimonials && wasOnSection) {
            stopAutoAdvance();
        }
    }

    // Check on scroll
    $(window).on('scroll', checkTestimonialsInView);
    
    // Initial check
    checkTestimonialsInView();

    // FAQ Accordion
    $('.faq-question').on('click', function() {
        const faqItem = $(this).closest('.faq-item');
        const isActive = faqItem.hasClass('active');
        
        // Close all FAQ items
        $('.faq-item').removeClass('active');
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.addClass('active');
        }
    });

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80 // Account for sticky navbar
            }, 600);
        }
    });

    // Check if page loaded with #thanks anchor and show thank you message
    if (window.location.hash === '#thanks') {
        // Scroll to contact section
        const contactSection = $('#contact');
        if (contactSection.length) {
            $('html, body').animate({
                scrollTop: contactSection.offset().top - 80
            }, 600);
            
            // Show thank you popup after a brief delay
            setTimeout(function() {
                alert('Thank you for your message! We will get back to you soon.');
            }, 700);
        }
    }

    // Contact form submission with web3forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);

            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    // Redirect to thank you page
                    window.location.href = window.location.origin + window.location.pathname + '#thanks';
                } else {
                    alert("Error: " + data.message);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }

            } catch (error) {
                alert("Something went wrong. Please try again.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
