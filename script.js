// Dra. Martina Valadão - Interactive JavaScript Features, Liquid Metal Buttons & Treatments Showcase
const ShaderMount = typeof window !== 'undefined' ? window.ShaderMount : null;
const liquidMetalFragmentShader = typeof window !== 'undefined' ? window.liquidMetalFragmentShader : null;

function initApp() {
    
    // 1. Sticky Header Blur Effect on Scroll
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Interactive FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');

            // Close all other active items
            document.querySelectorAll('.accordion-item.active').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                    const itemContent = item.querySelector('.accordion-content');
                    if (itemContent) itemContent.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                accordionItem.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                accordionItem.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 3. Interactive 5 Layers Tab Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all buttons & panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Activate target button & panel
            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 4. Smooth Anchor Link Scrolling with Header Offset
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mainNav.style.display === 'flex';
            mainNav.style.display = isOpen ? 'none' : 'flex';
            if (!isOpen) {
                mainNav.style.position = 'absolute';
                mainNav.style.top = '100%';
                mainNav.style.left = '0';
                mainNav.style.right = '0';
                mainNav.style.backgroundColor = 'rgba(246, 242, 238, 0.98)';
                mainNav.style.flexDirection = 'column';
                mainNav.style.padding = '1.5rem';
                mainNav.style.boxShadow = '0 12px 32px rgba(37, 33, 30, 0.1)';
            }
        });
    }

    // 6. React Bits / Shadcn Border Glow Mouse Tracking Effect
    const glowCards = document.querySelectorAll('.border-glow-card, .treatment-card, .testimonial-card, .quote-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 7. 21st.dev / johuniq Liquid Metal Buttons
    initLiquidMetalButtons();

    // 8. Interactive Treatments Cards & Dynamic Info Panel (Reference Style)
    initInteractiveTreatments();
}

// Data dictionary for treatments
const treatmentsData = {
    botox: {
        badge: 'TOXINA BOTULÍNICA',
        title: 'Botox Preventivo & Reparador',
        subtitle: 'Suavização precisa de linhas de expressão preservando sua naturalidade',
        desc: 'Atua relaxando temporariamente os músculos responsáveis pela formação de rugas dinâmicas na testa, glabela e ao redor dos olhos. O plano de aplicação da Dra. Martina prioriza a harmonia facial sem qualquer efeito engessado.',
        benefits: [
            'Suavização imediata de rugas na testa, glabela e pés de galinha',
            'Prevenção da transição de rugas dinâmicas em marcas profundas',
            'Procedimento rápido (20 min) com retorno imediato à rotina',
            'Durabilidade média de 4 a 6 meses com efeito gradual e suave'
        ],
        ctaText: 'Quero agendar Botox',
        waMessage: 'Olá! Gostaria de agendar uma avaliação para o tratamento de Botox (Toxina Botulínica).'
    },
    colageno: {
        badge: 'BIOESTIMULADORES DE COLÁGENO',
        title: 'Radiesse & Sculptra',
        subtitle: 'Restauração da firmeza, densidade e elasticidade profunda da pele',
        desc: 'Substâncias injetáveis biocompatíveis que estimulam as células do próprio organismo a produzirem novas fibras de colágeno e elastina de forma contínua por até 2 anos. Melhora notavelmente a flacidez facial e cervical.',
        benefits: [
            'Recuperação da sustentação e espessura dérmica natural',
            'Efeito lifting progressivo sem volumização excessiva',
            'Pele visivelmente mais compacta, viçosa e rejuvenescida',
            'Resultados de longa duração com produção ativa de colágeno'
        ],
        ctaText: 'Quero agendar Bioestimuladores',
        waMessage: 'Olá! Gostaria de agendar uma avaliação para Bioestimuladores de Colágeno.'
    },
    preenchimento: {
        badge: 'ÁCIDO HIALURÔNICO',
        title: 'Preenchimento Estratégico',
        subtitle: 'Restauração de volumes perdidos e definição dos contornos faciais',
        desc: 'Utilizado com ácido hialurônico de alta tecnologia médica em pontos específicos de sustentação: maçãs do rosto (malar), contorno mandibular, mento, olheiras profundas e hidratação labial delicada.',
        benefits: [
            'Reposição de volume nos compartimentos de gordura reabsorvidos',
            'Melhora visível da harmonia, do perfil e do contorno facial',
            'Hidratação profunda imediata com ácido hialurônico premium',
            'Técnica médica refinada que evita qualquer estigma artificial'
        ],
        ctaText: 'Quero agendar Preenchimento',
        waMessage: 'Olá! Gostaria de agendar uma avaliação para Preenchimento com Ácido Hialurônico.'
    },
    ultraformer: {
        badge: 'ULTRASSOM MICROFOCADO',
        title: 'Ultraformer MPT',
        subtitle: 'Lifting não-invasivo da face, contorno da mandíbula e papada',
        desc: 'Tecnologia padrão-ouro em ultrassom micro e macrofocado que atinge as camadas mais profundas (fáscia muscular SMAS), promovendo pontos de coagulação térmica que contraem o tecido e ativam colágeno intensamente.',
        benefits: [
            'Efeito lifting facial sem cortes, sem cirurgia e sem repouso',
            'Definição acentuada do contorno mandibular e redução de papada',
            'Tratamento seguro realizável em qualquer época do ano',
            'Resultados visíveis logo após a sessão com pico aos 90 dias'
        ],
        ctaText: 'Quero agendar Ultraformer',
        waMessage: 'Olá! Gostaria de agendar uma sessão de Ultraformer MPT.'
    },
    laser: {
        badge: 'LASER & CLAREAMENTO',
        title: 'Tratamento de Melasma & Manchas',
        subtitle: 'Uniformização do tom de pele e controle contínuo de hiperpigmentações',
        desc: 'Combinação médica de lasers de pulso ultracurto, peelings magistrais e ativos dermatológicos para degradar o excesso de melanina com segurança, controlando o melasma e manchas solares sem efeito rebote.',
        benefits: [
            'Clareamento progressivo e seguro de manchas solares e melasma',
            'Melhora global da textura, fechamento de poros e viço da pele',
            'Plano homecare associado para estabilização contínua do pigmento',
            'Segurança em todos os fototipos de pele com supervisão médica'
        ],
        ctaText: 'Quero agendar Laser & Manchas',
        waMessage: 'Olá! Gostaria de agendar uma avaliação para Tratamento de Manchas e Melasma.'
    }
};

function initInteractiveTreatments() {
    const defaultView = document.getElementById('treatment-default-view');
    const detailView = document.getElementById('treatment-detail-view');
    const infoPanel = document.getElementById('treatments-info-panel');
    const cards = document.querySelectorAll('.treatment-card');
    const track = document.getElementById('treatments-cards-track');
    const dots = document.querySelectorAll('#treatments-dots .carousel-dot');
    const prevBtn = document.getElementById('treatments-prev-btn');
    const nextBtn = document.getElementById('treatments-next-btn');

    if (!defaultView || !detailView || !cards.length) return;

    let activeTreatmentKey = null;

    // Reset to default overview view
    function resetToDefault() {
        if (!activeTreatmentKey) return;
        activeTreatmentKey = null;

        cards.forEach(c => {
            c.classList.remove('active');
            const footerLabel = c.querySelector('.footer-label');
            const footerIcon = c.querySelector('.footer-icon');
            if (footerLabel) footerLabel.textContent = 'Clique para saber mais';
            if (footerIcon) footerIcon.textContent = '+';
        });

        detailView.classList.remove('active');
        detailView.style.display = 'none';

        defaultView.style.display = 'block';
        defaultView.classList.add('active');
    }

    // Show details for specific treatment
    function showTreatmentDetails(key) {
        const data = treatmentsData[key];
        if (!data) return;

        activeTreatmentKey = key;

        // Update active class on cards
        cards.forEach(c => {
            const isTarget = c.getAttribute('data-treatment') === key;
            c.classList.toggle('active', isTarget);
            const footerLabel = c.querySelector('.footer-label');
            const footerIcon = c.querySelector('.footer-icon');
            if (footerLabel) footerLabel.textContent = isTarget ? 'Fechar detalhes' : 'Clique para saber mais';
            if (footerIcon) footerIcon.textContent = isTarget ? '−' : '+';
        });

        // Populate detail HTML
        detailView.innerHTML = `
            <div class="detail-header">
                <button type="button" class="btn-back-overview" id="btn-back-overview" aria-label="Voltar para visão geral">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Voltar à visão geral
                </button>
                <span class="tag-label">${data.badge}</span>
            </div>
            <h2 class="section-title headline-large" style="margin-bottom: 0.5rem; font-size: clamp(1.85rem, 2.5vw, 2.35rem);">${data.title}</h2>
            <p class="treatment-detail-subtitle">${data.subtitle}</p>
            <p class="section-description" style="margin-bottom: 1.5rem; font-size: 1rem; max-width: 520px;">${data.desc}</p>
            <ul class="treatment-detail-benefits">
                ${data.benefits.map(b => `<li><span class="check-bullet">✓</span>${b}</li>`).join('')}
            </ul>
            <div class="treatments-action-row">
                <a href="https://wa.me/5500000000000?text=${encodeURIComponent(data.waMessage)}" 
                   target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large liquid-metal-btn">
                    <div class="liquid-metal-shader"></div>
                    <div class="liquid-metal-core"></div>
                    <span class="btn-text">${data.ctaText}</span>
                    <span class="btn-arrow-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </span>
                </a>
            </div>
        `;

        // Switch views
        defaultView.classList.remove('active');
        defaultView.style.display = 'none';

        detailView.style.display = 'block';
        detailView.classList.add('active');

        // Init Liquid Metal Button on newly injected CTA
        initLiquidMetalButtons(detailView);

        // Bind back button
        const backBtn = detailView.querySelector('#btn-back-overview');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetToDefault();
            });
        }
    }

    // Handle card clicks
    cards.forEach(card => {
        const key = card.getAttribute('data-treatment');

        const triggerAction = (e) => {
            e.stopPropagation();
            if (activeTreatmentKey === key) {
                resetToDefault();
            } else {
                showTreatmentDetails(key);
            }
        };

        card.addEventListener('click', triggerAction);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerAction(e);
            }
        });
    });

    // Dismiss when clicking outside the card and outside the info panel
    document.addEventListener('click', (e) => {
        if (!activeTreatmentKey) return;
        const clickedCard = e.target.closest('.treatment-card');
        const clickedInfoPanel = e.target.closest('#treatments-info-panel');
        const clickedCarouselControls = e.target.closest('.treatments-carousel-controls');

        if (!clickedCard && !clickedInfoPanel && !clickedCarouselControls) {
            resetToDefault();
        }
    });

    // Carousel Navigation controls
    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -270, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 270, behavior: 'smooth' });
        });

        // Sync carousel dots with scroll
        track.addEventListener('scroll', () => {
            const scrollLeft = track.scrollLeft;
            const cardWidth = 270;
            const activeIndex = Math.round(scrollLeft / cardWidth);

            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        }, { passive: true });

        // Click dots to scroll
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                track.scrollTo({ left: idx * 270, behavior: 'smooth' });
            });
        });
    }
}

function initLiquidMetalButtons(container = document) {
    const buttons = container.querySelectorAll('.liquid-metal-btn');

    buttons.forEach(btn => {
        // Avoid double initialization
        if (btn.dataset.shaderInitialized === 'true') return;
        btn.dataset.shaderInitialized = 'true';

        const shaderContainer = btn.querySelector('.liquid-metal-shader');
        let shaderMount = null;

        if (shaderContainer) {
            try {
                shaderMount = new ShaderMount(
                    shaderContainer,
                    liquidMetalFragmentShader,
                    {
                        u_repetition: 4,
                        u_softness: 0.5,
                        u_shiftRed: 0.35,
                        u_shiftBlue: 0.3,
                        u_distortion: 0,
                        u_contour: 0,
                        u_angle: 45,
                        u_scale: 8,
                        u_shape: 1,
                        u_offsetX: 0.1,
                        u_offsetY: -0.1,
                    },
                    undefined,
                    0.6 // idle speed
                );
            } catch (err) {
                console.warn('Liquid Metal WebGL Shader fallback active:', err);
            }
        }

        // Dynamic hover speed acceleration
        btn.addEventListener('mouseenter', () => {
            if (shaderMount?.setSpeed) {
                shaderMount.setSpeed(1.2);
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (shaderMount?.setSpeed) {
                shaderMount.setSpeed(0.6);
            }
        });

        // Click Ripple and Fluid Speed Burst
        btn.addEventListener('click', (e) => {
            if (shaderMount?.setSpeed) {
                shaderMount.setSpeed(2.4);
                setTimeout(() => {
                    if (btn.matches(':hover')) {
                        shaderMount?.setSpeed(1.2);
                    } else {
                        shaderMount?.setSpeed(0.6);
                    }
                }, 350);
            }

            // Animated liquid ripple positioned at pointer coordinates
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'liquid-ripple';
            const size = Math.max(rect.width, rect.height) * 1.6;
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;

            btn.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 700);
        });
    });

    // 6. Hero Typewriter Animation Effect (Runs once on load)
    function initTypewriter() {
        const typewriterEl = document.getElementById('hero-typewriter');
        if (!typewriterEl) return;

        const text = "Seu tratamento também deve ser.";
        const speed = 90;
        let charIndex = 0;

        typewriterEl.textContent = '';

        function typeStep() {
            charIndex++;
            typewriterEl.textContent = text.slice(0, charIndex);

            if (charIndex < text.length) {
                setTimeout(typeStep, speed);
            }
        }

        setTimeout(typeStep, 400);
    }

    initTypewriter();
}

// Ensure execution whether DOM is already loaded or still loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
