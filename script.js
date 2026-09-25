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

    // 3. React Bits ScrollStack Controller (@reactbits-starter/scroll-stack-tw)
    const stackCards = document.querySelectorAll('.scroll-stack-card');

    if (stackCards.length > 0) {
        let ticking = false;

        const updateScrollStack = () => {
            stackCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardTop = rect.top;

                // When the next card scrolls up and overlaps this card
                if (index < stackCards.length - 1) {
                    const nextCard = stackCards[index + 1];
                    const nextRect = nextCard.getBoundingClientRect();
                    const overlapDistance = nextRect.top - cardTop;

                    if (overlapDistance < rect.height) {
                        // Calculate smooth overlap progress [0, 1]
                        const progress = Math.max(0, Math.min(1, 1 - (overlapDistance / rect.height)));

                        // React Bits depth transforms:
                        // Scale slightly down (0.94 min), dim brightness, subtle depth blur
                        const isMobile = window.innerWidth <= 768;
                        const scale = 1 - (progress * 0.05);
                        const brightness = 1 - (progress * 0.12);
                        const blur = isMobile ? 0 : progress * 1.2;

                        card.style.transform = `scale(${scale.toFixed(4)})`;
                        card.style.filter = blur > 0 
                            ? `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(1)}px)`
                            : `brightness(${brightness.toFixed(3)})`;
                    } else {
                        card.style.transform = 'scale(1)';
                        card.style.filter = 'none';
                    }
                } else {
                    card.style.transform = 'scale(1)';
                    card.style.filter = 'none';
                }
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollStack);
                ticking = true;
            }
        }, { passive: true });

        // Initial run
        updateScrollStack();
    }

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

// Data dictionary for treatments with before & after image pairs
const treatmentsData = {
    botox: {
        shortName: 'Botox',
        badge: 'TOXINA BOTULÍNICA',
        title: 'Botox',
        subtitle: 'Suaviza expressões. Preserva a sua naturalidade.',
        desc: 'O Botox é um tratamento seguro e minimamente invasivo que atua relaxando temporariamente a musculatura responsável pelas rugas dinâmicas (testa, glabela e pés de galinha), proporcionando um aspecto mais leve, descansado e harmonioso.',
        benefits: [
            'Suaviza rugas de expressão (testa, glabela e pés de galinha)',
            'Previne a formação de novas marcas mantendo a pele jovem',
            'Procedimento rápido (20 min) com retorno imediato à rotina',
            'Resultado natural e gradual valorizando suas feições'
        ],
        features: [
            { icon: '👤', title: 'Suaviza rugas de expressão', desc: 'Testa, glabela e pés de galinha' },
            { icon: '🌿', title: 'Previne a formação de novas marcas', desc: 'Mantém a aparência da pele por mais tempo' },
            { icon: '⏱️', title: 'Procedimento rápido e seguro', desc: 'Em média 20 minutos, com retorno imediato à rotina' },
            { icon: '✨', title: 'Resultado natural e gradual', desc: 'Valoriza sua expressão sem perder a naturalidade' }
        ],
        ctaText: 'Quero agendar meu Botox',
        waMessage: 'Olá! Gostaria de agendar uma consulta para o tratamento de Botox.',
        resultSubtitle: 'Pele mais leve, expressão mais descansada.',
        antesImg: 'assets/images/botox_antes.jpg',
        depoisImg: 'assets/images/botox_depois.jpg'
    },
    colageno: {
        shortName: 'Bioestimuladores',
        badge: 'BIOESTIMULADORES DE COLÁGENO',
        title: 'Bioestimuladores de Colágeno',
        subtitle: 'Firmeza, densidade e sustentação contínua.',
        desc: 'Substâncias biocompatíveis (Radiesse e Sculptra) injetadas para estimular as células do seu próprio organismo a produzirem novas fibras de colágeno e elastina de forma contínua por até 2 anos.',
        benefits: [
            'Estimulação profunda do seu próprio colágeno de forma biológica',
            'Efeito lifting progressivo e firmeza sem volumização excessiva',
            'Melhora o viço, textura e densidade da pele por até 2 anos',
            'Resultados duradouros com protocolos Radiesse e Sculptra'
        ],
        features: [
            { icon: '✨', title: 'Estimulação profunda de colágeno', desc: 'Recupera a densidade dérmica de forma biológica' },
            { icon: '🌿', title: 'Efeito lifting progressivo', desc: 'Firmeza visível sem volumização excessiva' },
            { icon: '💧', title: 'Melhora o viço e textura', desc: 'Pele visivelmente mais compacta e jovem' },
            { icon: '🛡️', title: 'Resultados duradouros', desc: 'Produção ativa por até 24 meses com acompanhamento médico' }
        ],
        ctaText: 'Quero agendar Bioestimuladores',
        waMessage: 'Olá! Gostaria de agendar uma consulta para Bioestimuladores de Colágeno.',
        resultSubtitle: 'Recuperação da densidade e firmeza natural da pele.',
        antesImg: 'assets/images/colageno_antes.jpg',
        depoisImg: 'assets/images/colageno_depois.jpg'
    },
    preenchimento: {
        shortName: 'Preenchimento',
        badge: 'ÁCIDO HIALURÔNICO',
        title: 'Preenchimento Estratégico',
        subtitle: 'Harmonia, sustentação e hidratação profunda.',
        desc: 'Aplicação médica em pontos anatômicos estratégicos de sustentação facial. Restaura volumes perdidos e refina contornos mantendo a sofisticação natural da sua face.',
        benefits: [
            'Restabelecimento de volume em pontos estratégicos (maçãs, mento, mandíbula)',
            'Hidratação e contorno labial delicado e natural',
            'Uso exclusivo de ácido hialurônico premium biocompatível',
            'Efeito imediato e harmonioso com acabamento imperceptível'
        ],
        features: [
            { icon: '💎', title: 'Restabelecimento de volume', desc: 'Sustentação precisa de maçãs do rosto, mandíbula e mento' },
            { icon: '💋', title: 'Hidratação e contorno labial', desc: 'Realce delicado e natural dos lábios' },
            { icon: '💧', title: 'Ácido hialurônico premium', desc: 'Alta biocompatibilidade e segurança médica' },
            { icon: '✨', title: 'Efeito imediato e harmonioso', desc: 'Sem estigmas artificiais ou exageros' }
        ],
        ctaText: 'Quero agendar Preenchimento',
        waMessage: 'Olá! Gostaria de agendar uma consulta para Preenchimento com Ácido Hialurônico.',
        resultSubtitle: 'Restauração de contornos com acabamento imperceptível.',
        antesImg: 'assets/images/preenchimento_antes.jpg',
        depoisImg: 'assets/images/preenchimento_depois.jpg'
    },
    ultraformer: {
        shortName: 'Ultrassom MPT',
        badge: 'ULTRASSOM MICROFOCADO',
        title: 'Ultraformer MPT',
        subtitle: 'Lifting não invasivo, firmeza e contorno definido.',
        desc: 'Tecnologia avançada de ultrassom micro e macrofocado que atinge as camadas fasciais profundas (SMAS), promovendo pontos de coagulação térmica que tracionam e firmam a pele.',
        benefits: [
            'Lifting facial sem cortes, sem cirurgia e sem tempo de repouso',
            'Definição do contorno mandibular e redução de papada',
            'Estímulo duplo de colágeno nas camadas profundas (SMAS)',
            'Procedimento seguro realizável durante todo o ano'
        ],
        features: [
            { icon: '⚡', title: 'Lifting facial sem cortes', desc: 'Tracionamento dos tecidos sem cirurgia ou repouso' },
            { icon: '🎯', title: 'Definição mandibular e papada', desc: 'Redução da gordura localizada e compactação tecidual' },
            { icon: '🌿', title: 'Estímulo duplo de colágeno', desc: 'Ação imediata com pico de resultados aos 90 dias' },
            { icon: '🛡️', title: 'Procedimento seguro e rápido', desc: 'Realizável em qualquer época do ano' }
        ],
        ctaText: 'Quero agendar Ultraformer MPT',
        waMessage: 'Olá! Gostaria de agendar uma sessão de Ultraformer MPT.',
        resultSubtitle: 'Efeito lifting sem cortes e contorno mandibular nítido.',
        antesImg: 'assets/images/ultraformer_antes.jpg',
        depoisImg: 'assets/images/ultraformer_depois.jpg'
    },
    laser: {
        shortName: 'Laser & Manchas',
        badge: 'LASER & CLAREAMENTO',
        title: 'Laser & Controle de Melasma',
        subtitle: 'Uniformidade do tom, clareamento e viço incomparável.',
        desc: 'Combinação médica de tecnologia a laser e ativos dermatológicos focados na degradação segura de pigmentos profundos e no controle do melasma sem efeito rebote.',
        benefits: [
            'Clareamento seguro de manchas solares e controle de melasma',
            'Refinamento da textura da pele e fechamento dos poros',
            'Tratamento preventivo e manutenção contínua sem efeito rebote',
            'Segurança comprovada para todos os fototipos faciais'
        ],
        features: [
            { icon: '✨', title: 'Clareamento seguro de manchas', desc: 'Ação efetiva sobre melasma e manchas solares' },
            { icon: '🔍', title: 'Textura e poros refinados', desc: 'Renovação celular com estímulo de colágeno' },
            { icon: '🛡️', title: 'Sem efeito rebote', desc: 'Protocolos com acompanhamento e homecare médico' },
            { icon: '☀️', title: 'Segurança em todos os fototipos', desc: 'Aplicação médica individualizada' }
        ],
        ctaText: 'Quero agendar Laser & Manchas',
        waMessage: 'Olá! Gostaria de agendar uma consulta para Tratamento de Manchas e Melasma.',
        resultSubtitle: 'Pele uniforme, sem manchas e com luminosidade natural.',
        antesImg: 'assets/images/laser_antes.jpg',
        depoisImg: 'assets/images/laser_depois.jpg'
    }
};

function initInteractiveTreatments() {
    const overviewGrid = document.getElementById('treatments-overview-grid');
    const detailContainer = document.getElementById('treatment-detail-container');
    const pillsBar = document.getElementById('treatments-pills-bar');
    const pillBtns = document.querySelectorAll('.treatment-pill-btn');
    const backOverviewBtn = document.getElementById('btn-back-overview');
    const cards = document.querySelectorAll('.treatment-card');
    const track = document.getElementById('treatments-cards-track');
    const dots = document.querySelectorAll('#treatments-dots .carousel-dot');
    const prevBtn = document.getElementById('treatments-prev-btn');
    const nextBtn = document.getElementById('treatments-next-btn');

    if (!overviewGrid || !detailContainer || !cards.length) return;

    let activeTreatmentKey = null;

    // Reset to overview cards view
    function resetToOverview() {
        activeTreatmentKey = null;

        cards.forEach(c => c.classList.remove('active'));

        if (pillsBar) pillsBar.style.display = 'none';
        detailContainer.style.display = 'none';
        detailContainer.innerHTML = '';

        overviewGrid.style.display = 'grid';

        // Scroll smoothly to section top if needed
        const section = document.getElementById('tratamentos');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Show detailed treatment view with Before/After comparison slider
    function showTreatmentDetails(key) {
        const data = treatmentsData[key];
        if (!data) return;

        activeTreatmentKey = key;

        // Hide overview grid, show pills bar & detail view
        overviewGrid.style.display = 'none';
        if (pillsBar) pillsBar.style.display = 'flex';
        detailContainer.style.display = 'block';

        // Update active pills
        pillBtns.forEach(btn => {
            const pillTarget = btn.getAttribute('data-pill');
            if (pillTarget) {
                btn.classList.toggle('active', pillTarget === key);
            }
        });

        // Re-trigger fluid motion animation on detailContainer
        detailContainer.style.animation = 'none';
        detailContainer.offsetHeight; // trigger reflow
        detailContainer.style.animation = null;

        const benefitsItems = data.benefits || (data.features ? data.features.map(f => `${f.title}: ${f.desc}`) : []);

        // Populate detail HTML matching exact reference text structure
        detailContainer.innerHTML = `
            <div class="treatment-detail-grid">
                <!-- Left Column: Treatment Details -->
                <div class="treatment-detail-left">
                    <div class="treatment-detail-badge">
                        <span class="tag-label">${data.badge}</span>
                    </div>
                    <h2 class="treatment-detail-title-main">${data.title}</h2>
                    <p class="treatment-detail-tagline">${data.subtitle}</p>
                    <p class="treatment-detail-paragraph">${data.desc}</p>
                    
                    <ul class="treatment-detail-benefits">
                        ${benefitsItems.map(b => `<li><span class="check-icon">✓</span> ${b}</li>`).join('')}
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
                </div>

                <!-- Right Column: Resultados Reais Card -->
                <div class="treatment-detail-right">
                    <div class="resultados-reais-card">
                        <div class="resultados-header">
                            <h3 class="resultados-title">Resultados reais</h3>
                            <p class="resultados-subtitle">${data.resultSubtitle}</p>
                        </div>
                        
                        <!-- 21st.dev Interactive Image Comparison Slider Component -->
                        <div class="image-comparison-slider" id="comparison-slider">
                            <img src="${data.depoisImg}" alt="Resultado Depois" class="comparison-img comparison-after">
                            
                            <div class="comparison-overlay" style="width: 50%;">
                                <img src="${data.antesImg}" alt="Resultado Antes" class="comparison-img comparison-before">
                            </div>
                            
                            <div class="comparison-handle" style="left: 50%;">
                                <div class="comparison-handle-button">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                        <polyline points="9 18 15 12 9 6" transform="rotate(180 12 12)"></polyline>
                                    </svg>
                                </div>
                            </div>
                            
                            <span class="comparison-badge badge-antes">Antes</span>
                            <span class="comparison-badge badge-depois">Depois</span>
                        </div>

                        <p class="resultados-footer-note">Resultados podem variar de acordo com as características individuais de cada paciente.</p>
                    </div>
                </div>
            </div>
        `;

        // Initialize Liquid Metal shader on newly injected CTA button
        initLiquidMetalButtons(detailContainer);

        // Bind interactive image comparison slider events
        const slider = detailContainer.querySelector('#comparison-slider');
        if (slider) {
            initComparisonSliderEvents(slider);
        }

        // Scroll section smoothly into view
        const section = document.getElementById('tratamentos');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 21st.dev Image Comparison Slider Touch & Drag Engine
    function initComparisonSliderEvents(slider) {
        const overlay = slider.querySelector('.comparison-overlay');
        const handle = slider.querySelector('.comparison-handle');
        if (!overlay || !handle) return;

        let isDragging = false;

        function updateSlider(clientX) {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            overlay.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        }

        const onStart = (e) => {
            isDragging = true;
            const pageX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(pageX);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const pageX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(pageX);
        };

        const onEnd = () => {
            isDragging = false;
        };

        slider.addEventListener('mousedown', onStart);
        slider.addEventListener('touchstart', onStart, { passive: true });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });

        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    // Bind card clicks
    cards.forEach(card => {
        const key = card.getAttribute('data-treatment');
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            showTreatmentDetails(key);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTreatmentDetails(key);
            }
        });
    });

    // Bind pill buttons
    pillBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pillTarget = btn.getAttribute('data-pill');
            if (pillTarget) {
                showTreatmentDetails(pillTarget);
            }
        });
    });

    // Bind back overview button
    if (backOverviewBtn) {
        backOverviewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetToOverview();
        });
    }

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

    // 6. Hero Typewriter Animation Effect (Runs once on load, hides cursor when done)
    function initTypewriter() {
        const typewriterEl = document.getElementById('hero-typewriter');
        const cursorEl = document.querySelector('.typewriter-cursor');
        if (!typewriterEl) return;

        const text = "Seu tratamento também deve ser.";
        const speed = 90;
        let charIndex = 0;

        typewriterEl.textContent = '';
        if (cursorEl) {
            cursorEl.style.opacity = '1';
            cursorEl.style.display = 'inline-block';
        }

        function typeStep() {
            charIndex++;
            typewriterEl.textContent = text.slice(0, charIndex);

            if (charIndex < text.length) {
                setTimeout(typeStep, speed);
            } else {
                // Hide cursor smoothly once phrase typing finishes
                setTimeout(() => {
                    if (cursorEl) {
                        cursorEl.style.transition = 'opacity 0.4s ease';
                        cursorEl.style.opacity = '0';
                        setTimeout(() => {
                            cursorEl.style.display = 'none';
                        }, 400);
                    }
                }, 600);
            }
        }

        setTimeout(typeStep, 400);
    }

    initTypewriter();

    // 7. About Video Interactive Controls (Play/Pause on click, Mute/Unmute toggle)
    function initAboutVideoControls() {
        const video = document.getElementById('about-video');
        const soundBtn = document.getElementById('video-sound-toggle');
        const playIndicator = document.getElementById('video-play-indicator');
        const videoFrame = document.getElementById('about-video-frame');

        if (!video) return;

        // Sound Mute / Unmute toggle
        if (soundBtn) {
            soundBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents frame click from triggering pause/play
                video.muted = !video.muted;
                updateSoundState();
            });
        }

        function updateSoundState() {
            if (!soundBtn) return;
            const iconMuted = soundBtn.querySelector('.sound-icon-muted');
            const iconUnmuted = soundBtn.querySelector('.sound-icon-unmuted');
            const btnText = soundBtn.querySelector('.sound-btn-text');

            if (video.muted) {
                if (iconMuted) iconMuted.style.display = 'block';
                if (iconUnmuted) iconUnmuted.style.display = 'none';
                if (btnText) btnText.textContent = 'Ativar som';
                soundBtn.setAttribute('aria-label', 'Ativar som');
            } else {
                if (iconMuted) iconMuted.style.display = 'none';
                if (iconUnmuted) iconUnmuted.style.display = 'block';
                if (btnText) btnText.textContent = 'Com som';
                soundBtn.setAttribute('aria-label', 'Desativar som');
            }
        }

        // Play/Pause toggle when clicking on video or video frame
        const togglePlay = () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        };

        if (videoFrame) {
            videoFrame.addEventListener('click', (e) => {
                // If user clicks directly on floating badge or sound button, ignore
                if (e.target.closest('.video-sound-btn') || e.target.closest('.about-floating-badge')) return;
                togglePlay();
            });
        }

        video.addEventListener('play', () => {
            if (playIndicator) playIndicator.classList.remove('paused');
        });

        video.addEventListener('pause', () => {
            if (playIndicator) playIndicator.classList.add('paused');
        });
    }

    initAboutVideoControls();
}

// Ensure execution whether DOM is already loaded or still loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
