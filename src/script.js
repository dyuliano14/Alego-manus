// Script para manipulação de flashcards e outras funcionalidades interativas

document.addEventListener('DOMContentLoaded', function() {
    // Gerenciamento do menu mobile
    setupMobileMenu();
    
    // Configuração de flashcards
    setupFlashcards();
    
    // Configuração de formulários
    setupForms();
    
    // Configuração de alertas
    setupAlerts();
    
    // Configuração de visualização de conteúdo
    setupContentViews();
});

/**
 * Configura o comportamento do menu mobile
 * Corrige o problema do menu sempre visível em dispositivos móveis
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbarNav = document.getElementById('navbar-nav');
    
    if (menuToggle && navbarNav) {
        // Verifica se é dispositivo móvel para configuração inicial
        if (window.innerWidth <= 992) {
            navbarNav.classList.remove('active');
            navbarNav.style.display = 'none';
        } else {
            navbarNav.style.display = 'flex';
        }
        
        // Adiciona evento de clique para alternar visibilidade
        menuToggle.addEventListener('click', function() {
            if (navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                setTimeout(() => {
                    navbarNav.style.display = 'none';
                }, 300); // Pequeno delay para animação
            } else {
                navbarNav.style.display = 'flex';
                // Pequeno delay para garantir que o display:flex seja aplicado antes da animação
                setTimeout(() => {
                    navbarNav.classList.add('active');
                }, 10);
            }
        });
        
        // Fecha o menu ao clicar em um link
        const navLinks = navbarNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    navbarNav.classList.remove('active');
                    setTimeout(() => {
                        navbarNav.style.display = 'none';
                    }, 300);
                }
            });
        });
        
        // Ajusta o menu ao redimensionar a janela
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                navbarNav.style.display = 'flex';
                navbarNav.classList.remove('active');
            } else if (!navbarNav.classList.contains('active')) {
                navbarNav.style.display = 'none';
            }
        });
    }
}

/**
 * Configura a interatividade dos flashcards
 * Implementa a funcionalidade de virar o cartão e registrar progresso
 */
function setupFlashcards() {
    // Virar flashcards na página de estudo
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    // Botões de resultado de estudo (fácil, médio, difícil)
    const resultButtons = document.querySelectorAll('.result-btn');
    resultButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que o clique propague para o flashcard
            
            const flashcardId = this.getAttribute('data-id');
            const resultado = this.getAttribute('data-result');
            
            if (flashcardId && resultado) {
                updateFlashcardProgress(flashcardId, resultado);
            }
        });
    });
    
    // Botões para mostrar/ocultar respostas na listagem
    const toggleButtons = document.querySelectorAll('.toggle-answer');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const container = this.closest('.card').querySelector('.answer-container');
            
            if (container.style.display === 'none') {
                container.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar resposta';
            } else {
                container.style.display = 'none';
                this.innerHTML = '<i class="fas fa-eye"></i> Ver resposta';
            }
        });
    });
}

/**
 * Atualiza o progresso de um flashcard via AJAX
 * @param {string} id - ID do flashcard
 * @param {string} resultado - Resultado do estudo (facil, medio, dificil)
 */
function updateFlashcardProgress(id, resultado) {
    // Cria um objeto FormData para enviar os dados
    const formData = new FormData();
    formData.append('resultado', resultado);
    
    // Configura a requisição fetch
    fetch(`/flashcards/atualizar/${id}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Remove o flashcard da lista após atualização
            const flashcard = document.querySelector(`.flashcard[data-id="${id}"]`);
            if (flashcard) {
                flashcard.classList.add('fade-out');
                setTimeout(() => {
                    flashcard.remove();
                    
                    // Verifica se ainda existem flashcards
                    const remainingCards = document.querySelectorAll('.flashcard').length;
                    if (remainingCards === 0) {
                        const container = document.querySelector('.flashcards-container');
                        if (container) {
                            container.innerHTML = `
                                <div class="alert alert-success">
                                    <p>Parabéns! Você concluiu todos os flashcards para hoje.</p>
                                    <a href="/flashcards" class="btn btn-primary mt-2">Voltar para Flashcards</a>
                                </div>
                            `;
                        }
                    }
                }, 300);
            }
        } else {
            // Exibe mensagem de erro
            showAlert('Erro ao atualizar flashcard. Tente novamente.', 'danger');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showAlert('Erro de conexão. Verifique sua internet.', 'danger');
    });
}

/**
 * Configura comportamentos específicos de formulários
 * Melhora a experiência de usuário em formulários de upload e criação
 */
function setupForms() {
    // Preview de arquivo selecionado em uploads
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const fileNameDisplay = document.createElement('div');
        fileNameDisplay.className = 'file-name mt-1 text-muted';
        input.parentNode.appendChild(fileNameDisplay);
        
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = `Arquivo selecionado: ${this.files[0].name}`;
            } else {
                fileNameDisplay.textContent = '';
            }
        });
    });
    
    // Validação de formulários antes do envio
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredInputs = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('invalid');
                    
                    // Adiciona mensagem de erro se não existir
                    let errorMsg = input.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message text-danger mt-1';
                        errorMsg.textContent = 'Este campo é obrigatório';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    input.classList.remove('invalid');
                    
                    // Remove mensagem de erro se existir
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
            }
        });
    });
    
    // Melhoria para textareas (auto-resize)
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Trigger inicial para ajustar altura
        if (textarea.value) {
            textarea.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Configura o comportamento dos alertas
 * Corrige o problema de alertas que desaparecem muito rápido
 */
function setupAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.persistent)');
    
    alerts.forEach(alert => {
        // Adiciona botão de fechar se não existir
        if (!alert.querySelector('.close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.style.float = 'right';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.fontSize = '1.25rem';
            closeBtn.style.fontWeight = 'bold';
            closeBtn.style.cursor = 'pointer';
            
            closeBtn.addEventListener('click', function() {
                fadeOutAlert(alert);
            });
            
            alert.insertBefore(closeBtn, alert.firstChild);
        }
        
        // Configura timeout mais longo (8 segundos)
        setTimeout(() => {
            fadeOutAlert(alert);
        }, 8000);
    });
}

/**
 * Função auxiliar para fazer fade out de alertas
 * @param {HTMLElement} alert - Elemento de alerta
 */
function fadeOutAlert(alert) {
    alert.style.opacity = '0';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 300);
}

/**
 * Exibe um alerta dinâmico
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo do alerta (success, info, warning, danger)
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    
    // Cria container se não existir
    if (!alertContainer) {
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.maxWidth = '400px';
        document.body.appendChild(container);
    }
    
    // Cria o alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <button class="close-btn" style="float:right;background:none;border:none;font-size:1.25rem;font-weight:bold;cursor:pointer;">&times;</button>
        ${message}
    `;
    
    // Adiciona evento para fechar
    alert.querySelector('.close-btn').addEventListener('click', function() {
        fadeOutAlert(alert);
    });
    
    // Adiciona ao container
    document.getElementById('alert-container').appendChild(alert);
    
    // Auto-remove após 8 segundos
    setTimeout(() => {
        fadeOutAlert(alert);
    }, 8000);
}

/**
 * Configura a visualização de conteúdo
 * Corrige problemas de conteúdo que desaparece após alguns segundos
 */
function setupContentViews() {
    // Garante que o conteúdo da técnica Feynman e Progresso não desapareça
    const contentContainers = document.querySelectorAll('.markdown-content, .feynman-content, .progress-content');
    
    contentContainers.forEach(container => {
        // Adiciona classe para garantir visibilidade permanente
        container.classList.add('persistent-content');
        
        // Garante que o conteúdo não seja afetado por scripts de fade-out
        container.setAttribute('data-persistent', 'true');
    });
    
    // Corrige problemas de visualização em botões
    const viewButtons = document.querySelectorAll('.view-btn, [data-action="view"]');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('href') || this.getAttribute('data-url');
            if (url) {
                // Usa navegação direta em vez de AJAX para evitar problemas
                window.location.href = url;
            }
        });
    });
}

/**
 * Função para detectar se o dispositivo é móvel
 * @returns {boolean} Verdadeiro se for dispositivo móvel
 */
function isMobileDevice() {
    return (window.innerWidth <= 992) || 
           (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i));
}

// Executa verificações adicionais após carregamento completo da página
window.addEventListener('load', function() {
    // Verifica se há elementos fora da viewport em dispositivos móveis
    if (isMobileDevice()) {
        fixMobileOverflow();
    }
    
    // Verifica se o service worker está disponível para PWA
    registerServiceWorker();
});

/**
 * Corrige elementos que estão fora da viewport em dispositivos móveis
 */
function fixMobileOverflow() {
    // Ajusta containers que podem estar transbordando
    const containers = document.querySelectorAll('.container, .card, .row');
    
    containers.forEach(container => {
        container.style.maxWidth = '100%';
        container.style.overflowX = 'hidden';
    });
    
    // Ajusta tabelas para serem responsivas
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            wrapper.style.overflowX = 'auto';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

/**
 * Registra o service worker para funcionalidade PWA
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.error('Falha ao registrar Service Worker:', error);
            });
    }
}
