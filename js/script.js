document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. SELEÇÃO DE TODOS OS ELEMENTOS
    // ===================================================================
    const audio = document.getElementById('stream-audio');
    const playPauseBtns = document.querySelectorAll('.controle-play-pause');
    const volumeSliders = document.querySelectorAll('.controle-volume-slider');
    const volumeIcons = document.querySelectorAll('.controle-volume-icone');
    const botaoOuvir = document.getElementById('BotaoOuça');
    const playerInferior = document.getElementById('player-inferior-spotify');

    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';
    const loadingIcon = '<i class="fas fa-spinner fa-spin"></i>';

    // ===================================================================
    // 2. LÓGICA DO PLAYER DE ÁUDIO
    // ===================================================================

    if (!audio) return;

    function togglePlayState() {
        audio.paused ? audio.play().catch(e => console.error("Erro ao tocar:", e)) : audio.pause();
    }

    audio.onplaying = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${pauseIcon} <span>PAUSAR</span>` : pauseIcon;
        });
        if (playerInferior) playerInferior.classList.add('player-visivel');
        document.body.classList.add('player-inferior-ativo');
    };

    audio.onpause = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${playIcon} <span>REPRODUZIR</span>` : playIcon;
        });
        if (playerInferior) playerInferior.classList.remove('player-visivel');
        document.body.classList.remove('player-inferior-ativo');
    };
    
    audio.onwaiting = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${loadingIcon} <span>CARREGANDO</span>` : loadingIcon;
        });
    };

    playPauseBtns.forEach(btn => btn.addEventListener('click', togglePlayState));
    
    if (botaoOuvir) {
        botaoOuvir.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlayState();
        });
    }

    volumeSliders.forEach(slider => {
        slider.addEventListener('input', function() {
            audio.volume = this.value;
            audio.muted = false;
        });
    });

    volumeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            audio.muted = !audio.muted;
        });
    });

    audio.addEventListener('volumechange', function() {
        const currentVolume = audio.muted ? 0 : audio.volume;
        volumeSliders.forEach(slider => slider.value = currentVolume);
        volumeIcons.forEach(icon => {
            if (currentVolume === 0) icon.innerHTML = '<i class="fas fa-volume-mute"></i>';
            else if (currentVolume < 0.5) icon.innerHTML = '<i class="fas fa-volume-down"></i>';
            else icon.innerHTML = '<i class="fas fa-volume-up"></i>';
        });
    });

    // ===================================================================
    // 3. CONTEÚDO DINÂMICO E ANIMAÇÕES
    // ===================================================================
    const agendaContainer = document.getElementById('agenda-row');
    if (agendaContainer) {
        const programacao = [{ horario: "O DIA TODO", nome: "Música e Informação" }];
        let cardsHTML = '';
        programacao.forEach(programa => {
            cardsHTML += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card-agenda">
                        <div class="horario">${programa.horario}</div>
                        <h3 class="nome-programa">${programa.nome}</h3>
                    </div>
                </div>`;
        });
        agendaContainer.innerHTML = cardsHTML;
    }
    
    const cardsAgenda = document.querySelectorAll('.card-agenda');
    if (cardsAgenda.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        cardsAgenda.forEach(card => observer.observe(card));
    }

    // ===================================================================
    // 4. NAVEGAÇÃO E COMPORTAMENTO DO MENU
    // ===================================================================
    document.querySelectorAll('.navbar-nav a[href]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href.includes('.html') && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    let offset = (href === '#home') ? 0 : 90;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    const navLinks = document.querySelectorAll('#navbarNav a');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

});

// ===================================================================
// 5. INICIALIZAÇÃO DE PLUGINS EXTERNOS
// ===================================================================
if (document.querySelector('.swiper-container')) {
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow', grabCursor: true, centeredSlides: true,
        slidesPerView: 'auto', loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        coverflowEffect: { rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
}

// ===================================================================
// 6. LÓGICA INTELIGENTE PARA LINKS DO WHATSAPP
// ===================================================================
function configurarLinksWhatsApp() {
    const numeroTelefone = '554192566711';
    const mensagemPadrao = 'Vim pelo site Radio Alpes Brasil';
    const mensagemCodificada = encodeURIComponent(mensagemPadrao);

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    let linkWhatsApp;

    if (isMobileDevice()) {
        linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemCodificada}`;
    } else {
        linkWhatsApp = `https://web.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemCodificada}`;
    }

    const linkFlutuante = document.getElementById('whatsapp-float-link');
    const linkRodape = document.getElementById('whatsapp-footer-link');

    if (linkFlutuante) linkFlutuante.href = linkWhatsApp;
    if (linkRodape) linkRodape.href = linkWhatsApp;
}

document.addEventListener('DOMContentLoaded', configurarLinksWhatsApp);