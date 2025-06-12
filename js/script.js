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
    // 2. LÓGICA DO PLAYER DE ÁUDIO COM LOCALSTORAGE
    // ===================================================================

    if (!audio) return;

    function togglePlayState() {
        if (audio.paused) {
            audio.play().catch(e => console.error("Erro ao tocar:", e));
        } else {
            audio.pause();
        }
    }

    // --- Eventos do Player ---
    audio.onplaying = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${pauseIcon} <span>PAUSAR</span>` : pauseIcon;
        });
        if (playerInferior) playerInferior.classList.add('player-visivel');
        document.body.classList.add('player-inferior-ativo');
        localStorage.setItem('radioAlpesPlayerState', 'playing'); // Salva o estado
    };

    audio.onpause = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${playIcon} <span>REPRODUZIR</span>` : playIcon;
        });
        if (playerInferior) playerInferior.classList.remove('player-visivel');
        document.body.classList.remove('player-inferior-ativo');
        localStorage.setItem('radioAlpesPlayerState', 'paused'); // Salva o estado
    };

    audio.onwaiting = function() {
        playPauseBtns.forEach(btn => {
            const playerPai = btn.closest('#player-lateral');
            btn.innerHTML = playerPai ? `${loadingIcon} <span>CARREGANDO</span>` : loadingIcon;
        });
    };

    // --- Eventos dos Controles ---
    playPauseBtns.forEach(btn => btn.addEventListener('click', togglePlayState));
    
    if (botaoOuvir) {
        botaoOuvir.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlayState();
        });
    }

    volumeSliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const newVolume = parseFloat(this.value);
            audio.volume = newVolume;
            audio.muted = false;
            localStorage.setItem('radioAlpesVolume', newVolume); // Salva o volume
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

    // --- LÓGICA DE AUTOPLAY AO CARREGAR A PÁGINA ---
    function iniciarPlayerSalvo() {
        const savedVolume = localStorage.getItem('radioAlpesVolume');
        if (savedVolume !== null) {
            audio.volume = parseFloat(savedVolume);
        }

        const savedState = localStorage.getItem('radioAlpesPlayerState');
        if (savedState === 'playing') {
            // Tenta dar o play. Se o navegador bloquear, um aviso aparecerá no console.
            audio.play().catch(e => {
                console.warn("Autoplay bloqueado pelo navegador. O usuário precisa interagir com a página.");
                // Se falhar, garante que o estado seja 'paused' para consistência.
                localStorage.setItem('radioAlpesPlayerState', 'paused');
            });
        }
    }
    
    iniciarPlayerSalvo();


    // ===================================================================
    // 3. OUTRAS FUNCIONALIDADES DA PÁGINA (PROGRAMAÇÃO, NAVEGAÇÃO, ETC)
    // ===================================================================
    const agendaContainer = document.getElementById('agenda-row');
    if (agendaContainer) {
        const programacao = [{ horario: "O DIA TODO", nome: "Música e Informação" }];
        let cardsHTML = '';
        programacao.forEach(programa => {
            cardsHTML += `<div class="col-md-6 col-lg-4 mb-4"><div class="card-agenda"><div class="horario">${programa.horario}</div><h3 class="nome-programa">${programa.nome}</h3></div></div>`;
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
// 4. INICIALIZAÇÃO DE PLUGINS EXTERNOS
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
// 5. LÓGICA INTELIGENTE PARA LINKS DO WHATSAPP
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