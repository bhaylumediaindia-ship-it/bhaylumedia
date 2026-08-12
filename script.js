/* ==========================================================================
   Bhaylu Media India - Master JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. Dark / Light Theme Toggle with Logo Switcher
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const headerLogo = document.getElementById('header-logo');
    const footerLogo = document.getElementById('footer-logo');

    const logoLightPath = 'assets/logos/logo-light.png';
    const logoDarkPath = 'assets/logos/logo-dark.png';

    // Saved Theme or Default to Dark
    const savedTheme = localStorage.getItem('bmi_theme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('bmi_theme', theme);
        
        if (theme === 'light') {
            headerLogo.src = logoLightPath;
            footerLogo.src = logoLightPath;
        } else {
            headerLogo.src = logoDarkPath;
            footerLogo.src = logoDarkPath;
        }
    }

    // ----------------------------------------------------------------------
    // 2. Mobile Menu Navigation Toggle
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (window.lucide) { window.lucide.createIcons(); }
            
            const openIcon = mobileToggle.querySelector('.open-icon');
            const closeIcon = mobileToggle.querySelector('.close-icon');
            
            if (navMenu.classList.contains('active')) {
                openIcon.style.display = 'none';
                closeIcon.style.display = 'block';
            } else {
                openIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('.open-icon').style.display = 'block';
                mobileToggle.querySelector('.close-icon').style.display = 'none';
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Consultation Modal Setup
    // ----------------------------------------------------------------------
    const modal = document.getElementById('consultation-modal');
    const modalClose = document.getElementById('modal-close');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            if (window.lucide) { window.lucide.createIcons(); }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ----------------------------------------------------------------------
    // 4. FAQ Accordion Toggle
    // ----------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked if was not active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 5. Testimonial Carousel Slider
    // ----------------------------------------------------------------------
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;

        // Build dots
        cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
            goToSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
            goToSlide(currentIndex);
        });

        // Auto Advance
        setInterval(() => {
            currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
            goToSlide(currentIndex);
        }, 6000);
    }

    // ----------------------------------------------------------------------
    // 6. Campaign Highlights Stats Counter Animation
    // ----------------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        const statsSection = document.getElementById('highlights');
        if (!statsSection) return;

        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !animated) {
            animated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                let count = 0;
                const speed = target / 50;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        stat.innerText = target;
                    }
                };

                updateCount();
            });
        }
    }

    window.addEventListener('scroll', animateStats);

    // ----------------------------------------------------------------------
    // 7. Lead Form Submission (Google Sheets Integration + Webhook)
    // ----------------------------------------------------------------------
    
    // Configurable Google Apps Script Web App Endpoint
    const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAA3jiOQ1frRR8G1yMIG_XngDeQN62JvthSAirpGJHFzlUWLFyzEPGwAu0am5aOwNL/exec";

    const leadForm = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('form-spinner');
    const formStatus = document.getElementById('form-status');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                timestamp: new Date().toLocaleString(),
                name: document.getElementById('name').value.trim(),
                company: document.getElementById('company').value.trim() || 'N/A',
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                service: document.getElementById('service').value,
                budget: document.getElementById('budget').value || 'Not Specified',
                message: document.getElementById('message').value.trim() || 'No message provided'
            };

            // Loading UI
            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';
            formStatus.className = 'form-status';
            formStatus.innerText = 'Submitting your request...';

            try {
                // Save locally as backup
                let localLeads = JSON.parse(localStorage.getItem('bmi_leads') || '[]');
                localLeads.push(formData);
                localStorage.setItem('bmi_leads', JSON.stringify(localLeads));

                // Send JSON data to Google Apps Script endpoint
                fetch(GOOGLE_SHEETS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(formData)
                }).catch(err => console.log('Google Sheet sync stored locally fallback: ', err));

                // Show Success
                setTimeout(() => {
                    spinner.style.display = 'none';
                    submitBtn.disabled = false;
                    formStatus.className = 'form-status success';
                    formStatus.innerText = '✨ Thank you! Your proposal request has been received. Our team will contact you within 2 hours.';
                    leadForm.reset();
                }, 1000);

            } catch (error) {
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                formStatus.className = 'form-status error';
                formStatus.innerText = 'Submission received! Our team will reach out directly.';
            }
        });
    }

    // Modal Form Handler
    const modalLeadForm = document.getElementById('modal-lead-form');
    if (modalLeadForm) {
        modalLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const modalFormData = {
                timestamp: new Date().toLocaleString(),
                name: document.getElementById('modal-name').value.trim(),
                company: 'Strategy Session Request',
                phone: document.getElementById('modal-phone').value.trim(),
                email: document.getElementById('modal-email').value.trim(),
                service: document.getElementById('modal-service').value,
                budget: 'Strategy Call',
                message: 'Requested Free 30-Min Strategy Call via Header / Modal CTA'
            };

            fetch(GOOGLE_SHEETS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(modalFormData)
            }).catch(err => console.log('Modal lead error: ', err));

            alert('🎉 Thank you! Your strategy call has been requested. A director will contact you via WhatsApp / Phone shortly.');
            modalLeadForm.reset();
            modal.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 8. Legal Right Slide Drawer Logic
    // ----------------------------------------------------------------------
    const legalDrawer = document.getElementById('legal-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerTitle = document.getElementById('drawer-title');
    const drawerBody = document.getElementById('drawer-body');

    const privacyPolicyHTML = `
        <div>
            <h4>1. Overview & Information We Collect</h4>
            <p>At <strong>Bhaylu Media India</strong>, we respect your privacy. When you request a proposal, book a consultation, or engage our PR & Digital Media services, we collect personal and business information including your name, company name, phone/WhatsApp number, email address, service intent, budget, and campaign objectives.</p>
        </div>
        <div>
            <h4>2. How We Use Your Data</h4>
            <p>We use the information collected strictly for:</p>
            <ul>
                <li>Designing customized PR, influencer, and digital media strategies.</li>
                <li>Executing media releases, press pitching, and influencer matching.</li>
                <li>Direct communication regarding proposal approvals and campaign reporting.</li>
                <li>Automated lead management and secure CRM record-keeping.</li>
            </ul>
        </div>
        <div>
            <h4>3. Confidentiality & Data Security</h4>
            <p>Your brand assets, press materials, contact lists, and campaign details are treated with strict confidentiality. We do not sell or rent your personal data to third parties under any circumstances.</p>
        </div>
        <div>
            <h4>4. Third-Party Media Partners</h4>
            <p>To execute campaigns, selected press releases or influencer briefs may be shared with verified publication houses, media outlets, and creator partners strictly for campaign delivery purposes.</p>
        </div>
        <div>
            <h4>5. Contact Our Privacy Officer</h4>
            <p>If you have questions or wish to request data updates, please contact us directly at <strong>bhaylumediaindia@gmail.com</strong> or call <strong>+91 8160308597</strong>.</p>
        </div>
    `;

    const termsConditionsHTML = `
        <div>
            <h4>1. Scope of Services</h4>
            <p><strong>Bhaylu Media India</strong> provides strategic PR, digital media buying, influencer marketing, community page promotions, social media management, performance advertising, online reputation management (ORM), content marketing, and WhatsApp CRM automation.</p>
        </div>
        <div>
            <h4>2. Campaign Onboarding & Approvals</h4>
            <p>All press releases, creative collateral, and influencer briefs must be reviewed and approved by the client prior to public distribution. Digital PR placements on tier-1 outlets are subject to editorial guidelines of publishing partner houses.</p>
        </div>
        <div>
            <h4>3. Delivery Timelines & Distribution</h4>
            <p>Standard Digital PR distribution is typically fulfilled within 24 to 72 business hours after final material sign-off. Influencer and community page promotions execute according to the agreed campaign roadmap calendar.</p>
        </div>
        <div>
            <h4>4. Intellectual Property & Brand Assets</h4>
            <p>Clients retain full ownership of their logos, trademarks, and brand materials provided for campaign execution. Bhaylu Media India retains rights to showcase non-confidential campaign deliverables as part of our agency portfolio.</p>
        </div>
        <div>
            <h4>5. Limitation of Liability</h4>
            <p>Bhaylu Media India is committed to delivering maximum reach and transparent reporting. We are not liable for third-party platform algorithm updates, external social media network downtime, or editorial modifications by independent press editors.</p>
        </div>
    `;

    function openLegalDrawer(type) {
        if (type === 'privacy') {
            drawerTitle.innerText = 'Privacy Policy';
            drawerBody.innerHTML = privacyPolicyHTML;
        } else {
            drawerTitle.innerText = 'Terms & Conditions';
            drawerBody.innerHTML = termsConditionsHTML;
        }
        legalDrawer.classList.add('active');
    }

    const legalTriggers = document.querySelectorAll('.legal-trigger');
    legalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            if (href === '#terms' || btn.id === 'open-terms-btn') {
                openLegalDrawer('terms');
            } else {
                openLegalDrawer('privacy');
            }
        });
    });

    if (drawerClose) {
        drawerClose.addEventListener('click', () => {
            legalDrawer.classList.remove('active');
        });
    }

    if (legalDrawer) {
        legalDrawer.addEventListener('click', (e) => {
            if (e.target === legalDrawer) {
                legalDrawer.classList.remove('active');
            }
        });
    }

});
