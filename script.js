document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. HEADER DINÂMICO (SCROLL)
    // =======================================================
    const header = document.getElementById('main-header');
    const heroSection = document.getElementById('hero');
    
    const handleScroll = () => {
        // Adiciona a classe 'scrolled' após o usuário rolar 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);


    // =======================================================
    // 2. LAZY LOADING & INTERSECTION OBSERVER (Performance)
    // =======================================================
    
    // Configurações para carregar elementos apenas quando visíveis
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Imagens Lazy Loading
                if (entry.target.tagName === 'IMG' && entry.target.dataset.src) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.removeAttribute('data-src');
                    entry.target.classList.remove('lazy-image');
                }

                // Animação de Seção (Fade-in e Slide-up)
                if (entry.target.classList.contains('section-title')) {
                    entry.target.classList.add('visible');
                }
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.classList.add('animate-in');
                }
                
                // Parar de observar após carregar/animar
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px', // Inicia o carregamento 100px antes de entrar na tela
        threshold: 0.1
    });

    // Observa todas as imagens com a classe 'lazy-image'
    document.querySelectorAll('.lazy-image').forEach(img => lazyLoadObserver.observe(img));

    // Observa todos os títulos de seção e cards de feature para animação
    document.querySelectorAll('.section-title').forEach(title => lazyLoadObserver.observe(title));
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        // Delay para as features
        card.style.transitionDelay = `${index * 0.2}s`; 
        lazyLoadObserver.observe(card);
    });

    // =======================================================
    // 3. ANIMAÇÃO DE ENTRADA DA HERO (Inicial)
    // =======================================================
    
    // Utiliza uma pequena biblioteca de animação (simulada via classes)
    const heroSubtitle = document.querySelector('.hero-content .subtitle');
    const heroTitle = document.querySelector('.hero-content .title-main');
    const heroCta = document.querySelector('.hero-content .cta-group');

    // Timeout para dar o efeito de entrada em cascata
    setTimeout(() => {
        heroSubtitle.style.transition = 'opacity 1s ease 0.5s, transform 1s ease 0.5s';
        heroTitle.style.transition = 'opacity 1s ease 1s, transform 1s ease 1s';
        heroCta.style.transition = 'opacity 1s ease 1.5s, transform 1s ease 1.5s';
        
        // Adiciona as propriedades finais para o CSS aplicar a transição
        heroSubtitle.style.opacity = 1;
        heroTitle.style.opacity = 1;
        heroCta.style.opacity = 1;

        // Opcional: Efeito de 'slide-up' no título
        heroTitle.style.transform = 'translateY(0)'; 

    }, 100); // Pequeno delay inicial para garantir que o DOM está pronto


    // =======================================================
    // 4. NAVEGAÇÃO MOBILE
    // =======================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('#main-header ul');

    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
        // Opcional: Animação do ícone do menu-toggle (hamburger para X)
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('#main-header ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
            }
        });
    });

    // =======================================================
    // 5. CAROUSEL DE PERSONAGENS (Slider Manual)
    // =======================================================
    const slider = document.querySelector('.character-slider');
    const cards = document.querySelectorAll('.character-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentIndex = 0;

    const updateSlider = () => {
        // Remove a classe 'active' de todos
        cards.forEach(card => card.classList.remove('active'));
        
        // Adiciona a classe 'active' ao card atual
        cards[currentIndex].classList.add('active');
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    });

    // Inicializa o slider
    updateSlider();


    // =======================================================
    // 6. CARREGAMENTO DE VÍDEO OTIMIZADO (UX para Mídia)
    // =======================================================
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const videoContainer = document.getElementById('trailer');

    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            const videoId = videoPlaceholder.dataset.videoId;
            if (videoId) {
                // Cria o iframe do YouTube
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                
                // Substitui o placeholder pelo iframe
                videoContainer.innerHTML = '';
                videoContainer.appendChild(iframe);
            }
        });
    }

    // =======================================================
    // 7. CONTADOR ANIMADO (ESTATÍSTICAS)
    // =======================================================
    const statItems = document.querySelectorAll('.stat-item');

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const targetValue = parseInt(statNumber.dataset.target);
                const isPercentage = statNumber.textContent.includes('%');
                
                let startValue = 0;
                const duration = 2000; // 2 segundos
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Cálculo de progressão com easing (acelera/desacelera)
                    const easedProgress = 1 - Math.pow(1 - progress, 3); 
                    
                    const currentValue = Math.floor(easedProgress * targetValue);
                    
                    // Formatação do número
                    let formattedValue = currentValue.toLocaleString('pt-BR');
                    if (isPercentage) {
                        formattedValue = `${currentValue}%`;
                    } else if (currentValue > 1000) {
                        // Adiciona ponto para milhares
                        formattedValue = currentValue.toLocaleString('pt-BR'); 
                    }

                    statNumber.textContent = formattedValue;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                };
                
                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Inicia o contador quando 50% do item estiver visível
    });

    // Observa todos os itens de estatística
    statItems.forEach(item => statObserver.observe(item));

    // =======================================================
    // 8. SUBMISSÃO DE NEWSLETTER (Feedback de UX)
    // =======================================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            // Simulação de envio (em um ambiente real, você usaria AJAX aqui)
            alert(`Obrigado por se juntar ao caos, ${emailInput.value}! Fique de olho na sua caixa de entrada.`);
            
            // Limpa o campo e desativa o formulário
            emailInput.value = '';
            newsletterForm.innerHTML = `<p class="success-message">🎉 E-mail capturado! Fique atento às revelações exclusivas.</p>`;
            
            // Adiciona um estilo simples para a mensagem de sucesso (opcional, pode ser feito no CSS)
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.style.color = 'var(--color-accent-gold)';
                successMessage.style.fontSize = '1.2rem';
                successMessage.style.marginTop = '20px';
            }
        });
    }

});