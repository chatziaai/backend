// ChatzIA - JavaScript Application Logic

class ChatzIA {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.agents = [];
        this.currentAgent = null;
        this.currentSection = 'dashboard-home';
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.startDemoChat();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
        });
        
        // If DOM is already loaded, bind events immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Header buttons
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const demoBtn = document.getElementById('demoBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const dashboardBtn = document.getElementById('dashboardBtn');

        if (loginBtn) loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('login');
        });
        
        if (signupBtn) signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('signup');
        });
        
        if (getStartedBtn) getStartedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('signup');
        });
        
        if (demoBtn) demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToSection('features');
        });
        
        if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        if (dashboardBtn) dashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDashboard();
        });

        // Auth modal
        const closeAuth = document.getElementById('closeAuth');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const authForm = document.getElementById('authForm');

        if (closeAuth) closeAuth.addEventListener('click', () => this.hideAuthModal());
        if (authSwitchBtn) authSwitchBtn.addEventListener('click', () => this.toggleAuthMode());
        if (authForm) authForm.addEventListener('submit', (e) => this.handleAuth(e));

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.scrollToSection(href.substring(1));
                }
            });
        });

        // Pricing buttons
        document.querySelectorAll('.pricing-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = btn.textContent.trim();
                if (text.includes('Gratis') || text.includes('Prueba')) {
                    this.showAuthModal('signup');
                } else if (text.includes('Contactar')) {
                    this.showToast('Funcionalidad de contacto próximamente', 'info');
                }
            });
        });

        // Dashboard navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Agent creation wizard
        const createFirstAgent = document.getElementById('createFirstAgent');
        const newAgentBtn = document.getElementById('newAgentBtn');
        const nextStep1 = document.getElementById('nextStep1');
        const nextStep2 = document.getElementById('nextStep2');
        const prevStep2 = document.getElementById('prevStep2');
        const prevStep3 = document.getElementById('prevStep3');
        const createAgent = document.getElementById('createAgent');

        if (createFirstAgent) createFirstAgent.addEventListener('click', () => this.showSection('create-agent'));
        if (newAgentBtn) newAgentBtn.addEventListener('click', () => this.showSection('create-agent'));
        if (nextStep1) nextStep1.addEventListener('click', () => this.nextWizardStep(2));
        if (nextStep2) nextStep2.addEventListener('click', () => this.nextWizardStep(3));
        if (prevStep2) prevStep2.addEventListener('click', () => this.prevWizardStep(1));
        if (prevStep3) prevStep3.addEventListener('click', () => this.prevWizardStep(2));
        if (createAgent) createAgent.addEventListener('click', () => this.createNewAgent());

        // Agent modal
        const closeAgent = document.getElementById('closeAgent');
        const addFaqBtn = document.getElementById('addFaqBtn');

        if (closeAgent) closeAgent.addEventListener('click', () => this.hideAgentModal());
        if (addFaqBtn) addFaqBtn.addEventListener('click', () => this.addFaqItem());

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        // Demo chat
        const demoInput = document.getElementById('demoInput');
        if (demoInput) {
            demoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendDemoMessage();
                }
            });
        }

        // Test chat
        const testChatInput = document.getElementById('testChatInput');
        const sendTestMessage = document.getElementById('sendTestMessage');
        
        if (testChatInput) {
            testChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendTestMessage();
                }
            });
        }
        if (sendTestMessage) sendTestMessage.addEventListener('click', () => this.sendTestMessage());

        // Modal close on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAuthModal();
                this.hideAgentModal();
            }
        });
    }

    // Sample Data Loading
    loadSampleData() {
        this.agents = [
            {
                id: 1,
                name: 'Asistente de Ventas',
                description: 'Ayuda con consultas sobre productos y precios',
                industry: 'ecommerce',
                tone: 'friendly',
                welcomeMessage: '¡Hola! Soy tu asistente de ventas. ¿En qué producto estás interesado?',
                language: 'es',
                channels: ['web', 'whatsapp'],
                status: 'active',
                conversations: 247,
                resolution_rate: 87,
                avg_response_time: '2.3min',
                faqs: [
                    {
                        id: 1,
                        question: '¿Cuáles son sus horarios de atención?',
                        answer: 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM.',
                        category: 'General'
                    },
                    {
                        id: 2,
                        question: '¿Hacen envíos a toda España?',
                        answer: 'Sí, realizamos envíos a toda España. El tiempo de entrega es de 24-48 horas.',
                        category: 'Envíos'
                    }
                ]
            },
            {
                id: 2,
                name: 'Soporte Técnico',
                description: 'Resuelve problemas técnicos básicos',
                industry: 'tech',
                tone: 'professional',
                welcomeMessage: 'Hola, soy el asistente de soporte técnico. ¿Qué problema estás experimentando?',
                language: 'es',
                channels: ['web', 'telegram'],
                status: 'active',
                conversations: 156,
                resolution_rate: 92,
                avg_response_time: '1.8min',
                faqs: [
                    {
                        id: 3,
                        question: '¿Cómo reinicio mi contraseña?',
                        answer: 'Puedes reiniciar tu contraseña desde la página de login haciendo clic en "Olvidé mi contraseña".',
                        category: 'Cuenta'
                    }
                ]
            }
        ];
    }

    // Demo Chat Animation
    startDemoChat() {
        const demoResponses = [
            '¿Cuáles son sus horarios?',
            'Necesito ayuda con mi pedido',
            '¿Tienen descuentos disponibles?',
            'Información sobre garantías'
        ];

        let messageIndex = 0;
        
        const chatInterval = setInterval(() => {
            const demoChat = document.getElementById('demoChat');
            if (!demoChat) {
                clearInterval(chatInterval);
                return;
            }

            if (messageIndex < demoResponses.length) {
                this.addDemoChatMessage(demoResponses[messageIndex], 'user');
                
                setTimeout(() => {
                    let response = '';
                    switch (messageIndex) {
                        case 0:
                            response = 'Nuestro horario es de lunes a viernes, 9 AM a 6 PM. ¿En qué más puedo ayudarte?';
                            break;
                        case 1:
                            response = 'Claro, puedo ayudarte con tu pedido. ¿Podrías proporcionarme tu número de pedido?';
                            break;
                        case 2:
                            response = 'Sí, tenemos descuentos especiales. El 20% en tu primera compra con código BIENVENIDO20.';
                            break;
                        case 3:
                            response = 'Ofrecemos garantía de 2 años en todos nuestros productos. ¿Qué producto te interesa?';
                            break;
                    }
                    this.addDemoChatMessage(response, 'bot');
                }, 1000);
                
                messageIndex++;
            } else {
                messageIndex = 0;
                // Clear chat after all messages
                setTimeout(() => {
                    const chatMessages = document.getElementById('demoChat');
                    if (chatMessages) {
                        chatMessages.innerHTML = '<div class="message bot-message"><div class="message-content">¡Hola! Soy tu agente IA. ¿En qué puedo ayudarte hoy?</div></div>';
                    }
                }, 2000);
            }
        }, 5000);
    }

    addDemoChatMessage(content, type) {
        const chatMessages = document.getElementById('demoChat');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Authentication
    showAuthModal(mode) {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const submitBtn = document.getElementById('authSubmit');
        const switchText = document.getElementById('authSwitchText');
        const switchBtn = document.getElementById('authSwitchBtn');
        const nameGroup = document.getElementById('nameGroup');

        if (!modal) return;

        if (mode === 'login') {
            if (title) title.textContent = 'Iniciar Sesión';
            if (submitBtn) submitBtn.textContent = 'Entrar';
            if (switchText) switchText.textContent = '¿No tienes cuenta?';
            if (switchBtn) switchBtn.textContent = 'Registrarse';
            if (nameGroup) nameGroup.style.display = 'none';
        } else {
            if (title) title.textContent = 'Crear Cuenta';
            if (submitBtn) submitBtn.textContent = 'Registrarse';
            if (switchText) switchText.textContent = '¿Ya tienes cuenta?';
            if (switchBtn) switchBtn.textContent = 'Iniciar Sesión';
            if (nameGroup) nameGroup.style.display = 'block';
        }

        modal.classList.remove('hidden');
        modal.dataset.mode = mode;
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('hidden');
    }

    toggleAuthMode() {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        
        const currentMode = modal.dataset.mode;
        const newMode = currentMode === 'login' ? 'signup' : 'login';
        this.showAuthModal(newMode);
    }

    handleAuth(e) {
        e.preventDefault();
        const modal = document.getElementById('authModal');
        if (!modal) return;

        const mode = modal.dataset.mode;
        const emailInput = document.getElementById('authEmail');
        const passwordInput = document.getElementById('authPassword');
        const nameInput = document.getElementById('authName');

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value;
        const password = passwordInput.value;
        const name = nameInput ? nameInput.value : '';

        if (mode === 'signup' && !name) {
            this.showToast('Por favor, ingresa tu nombre completo', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Por favor, ingresa un email válido', 'error');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        // Simulate authentication
        this.currentUser = {
            id: 1,
            name: name || 'Usuario Demo',
            email: email,
            plan: 'Gratis',
            created_at: new Date()
        };
        
        this.isAuthenticated = true;
        this.hideAuthModal();
        this.updateHeaderForUser();
        this.showDashboard();
        
        const welcomeMessage = mode === 'signup' 
            ? `¡Bienvenido a ChatzIA, ${this.currentUser.name}!` 
            : `¡Hola de nuevo, ${this.currentUser.name}!`;
        
        this.showToast(welcomeMessage, 'success');
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.updateHeaderForGuest();
        this.hideDashboard();
        this.showToast('Has cerrado sesión correctamente', 'info');
    }

    updateHeaderForUser() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const userMenu = document.getElementById('userMenu');

        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userMenu) userMenu.classList.remove('hidden');
    }

    updateHeaderForGuest() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const userMenu = document.getElementById('userMenu');

        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (signupBtn) signupBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.classList.add('hidden');
    }

    // Dashboard Management
    showDashboard() {
        const landingPage = document.getElementById('landingPage');
        const dashboard = document.getElementById('dashboard');

        if (landingPage) landingPage.style.display = 'none';
        if (dashboard) dashboard.classList.remove('hidden');
        
        this.showSection('dashboard-home');
        this.renderAgents();
        setTimeout(() => this.initializeCharts(), 500);
    }

    hideDashboard() {
        const landingPage = document.getElementById('landingPage');
        const dashboard = document.getElementById('dashboard');

        if (landingPage) landingPage.style.display = 'block';
        if (dashboard) dashboard.classList.add('hidden');
    }

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) activeSection.classList.add('active');

        this.currentSection = sectionId;

        // Initialize section-specific content
        if (sectionId === 'agents') {
            this.renderAgents();
        } else if (sectionId === 'analytics') {
            setTimeout(() => this.initializeCharts(), 100);
        } else if (sectionId === 'create-agent') {
            this.resetWizard();
        }
    }

    // Agent Management
    renderAgents() {
        const agentsGrid = document.getElementById('agentsGrid');
        if (!agentsGrid) return;

        agentsGrid.innerHTML = '';

        this.agents.forEach(agent => {
            const agentCard = document.createElement('div');
            agentCard.className = 'agent-card';
            agentCard.innerHTML = `
                <div class="agent-header">
                    <h3 class="agent-name">${agent.name}</h3>
                    <span class="status status--success">${agent.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                </div>
                <p>${agent.description}</p>
                <div class="agent-stats">
                    <div class="agent-stat">
                        <span class="agent-stat-number">${agent.conversations}</span>
                        <span class="agent-stat-label">Conversaciones</span>
                    </div>
                    <div class="agent-stat">
                        <span class="agent-stat-number">${agent.resolution_rate}%</span>
                        <span class="agent-stat-label">Resolución</span>
                    </div>
                    <div class="agent-stat">
                        <span class="agent-stat-number">${agent.avg_response_time}</span>
                        <span class="agent-stat-label">Resp. Promedio</span>
                    </div>
                </div>
                <div class="agent-actions">
                    <button class="btn btn--primary btn--sm" onclick="app.editAgent(${agent.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="app.testAgent(${agent.id})">
                        <i class="fas fa-play"></i> Probar
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="app.duplicateAgent(${agent.id})">
                        <i class="fas fa-copy"></i> Clonar
                    </button>
                </div>
            `;
            agentsGrid.appendChild(agentCard);
        });
    }

    editAgent(agentId) {
        this.currentAgent = this.agents.find(a => a.id === agentId);
        if (!this.currentAgent) return;

        const agentModalTitle = document.getElementById('agentModalTitle');
        const editAgentName = document.getElementById('editAgentName');
        const editWelcomeMessage = document.getElementById('editWelcomeMessage');
        const agentModal = document.getElementById('agentModal');

        if (agentModalTitle) agentModalTitle.textContent = `Gestionar: ${this.currentAgent.name}`;
        if (editAgentName) editAgentName.value = this.currentAgent.name;
        if (editWelcomeMessage) editWelcomeMessage.value = this.currentAgent.welcomeMessage;
        
        this.renderFAQList();
        if (agentModal) agentModal.classList.remove('hidden');
    }

    testAgent(agentId) {
        this.currentAgent = this.agents.find(a => a.id === agentId);
        if (!this.currentAgent) return;

        const agentModalTitle = document.getElementById('agentModalTitle');
        const agentModal = document.getElementById('agentModal');

        if (agentModalTitle) agentModalTitle.textContent = `Probar: ${this.currentAgent.name}`;
        this.switchTab('test');
        if (agentModal) agentModal.classList.remove('hidden');
    }

    duplicateAgent(agentId) {
        const originalAgent = this.agents.find(a => a.id === agentId);
        if (!originalAgent) return;

        const newAgent = {
            ...originalAgent,
            id: Date.now(),
            name: `${originalAgent.name} (Copia)`,
            conversations: 0,
            resolution_rate: 0,
            avg_response_time: '0min'
        };

        this.agents.push(newAgent);
        this.renderAgents();
        this.showToast(`Agente "${newAgent.name}" clonado exitosamente`, 'success');
    }

    hideAgentModal() {
        const agentModal = document.getElementById('agentModal');
        if (agentModal) agentModal.classList.add('hidden');
        this.currentAgent = null;
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeTabBtn) activeTabBtn.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        const activeTabPane = document.querySelector(`.tab-pane[data-tab="${tabName}"]`);
        if (activeTabPane) activeTabPane.classList.add('active');
    }

    // FAQ Management
    renderFAQList() {
        const faqList = document.getElementById('faqList');
        if (!faqList || !this.currentAgent) return;

        faqList.innerHTML = '';

        this.currentAgent.faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <div class="faq-question">${faq.question}</div>
                <div class="faq-answer">${faq.answer}</div>
                <div class="faq-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.editFAQ(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="app.deleteFAQ(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            faqList.appendChild(faqItem);
        });
    }

    addFaqItem() {
        if (!this.currentAgent) return;

        const question = prompt('Ingresa la pregunta:');
        if (!question) return;

        const answer = prompt('Ingresa la respuesta:');
        if (!answer) return;

        const newFaq = {
            id: Date.now(),
            question: question,
            answer: answer,
            category: 'General'
        };

        this.currentAgent.faqs.push(newFaq);
        this.renderFAQList();
        this.showToast('FAQ agregada exitosamente', 'success');
    }

    editFAQ(index) {
        if (!this.currentAgent || !this.currentAgent.faqs[index]) return;

        const faq = this.currentAgent.faqs[index];
        const newQuestion = prompt('Editar pregunta:', faq.question);
        if (newQuestion === null) return;

        const newAnswer = prompt('Editar respuesta:', faq.answer);
        if (newAnswer === null) return;

        faq.question = newQuestion;
        faq.answer = newAnswer;
        
        this.renderFAQList();
        this.showToast('FAQ actualizada exitosamente', 'success');
    }

    deleteFAQ(index) {
        if (!this.currentAgent || !this.currentAgent.faqs[index]) return;

        if (confirm('¿Estás seguro de que quieres eliminar esta FAQ?')) {
            this.currentAgent.faqs.splice(index, 1);
            this.renderFAQList();
            this.showToast('FAQ eliminada exitosamente', 'info');
        }
    }

    // Wizard Management
    resetWizard() {
        const agentBasicForm = document.getElementById('agentBasicForm');
        const agentPersonalityForm = document.getElementById('agentPersonalityForm');
        const agentConfigForm = document.getElementById('agentConfigForm');

        if (agentBasicForm) agentBasicForm.reset();
        if (agentPersonalityForm) agentPersonalityForm.reset();
        if (agentConfigForm) agentConfigForm.reset();

        this.showWizardStep(1);
    }

    showWizardStep(stepNumber) {
        // Update progress indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show correct step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextWizardStep(stepNumber) {
        if (this.validateWizardStep(stepNumber - 1)) {
            this.showWizardStep(stepNumber);
        }
    }

    prevWizardStep(stepNumber) {
        this.showWizardStep(stepNumber);
    }

    validateWizardStep(stepNumber) {
        switch (stepNumber) {
            case 1:
                const agentNameInput = document.getElementById('agentName');
                if (!agentNameInput || !agentNameInput.value.trim()) {
                    this.showToast('Por favor, ingresa un nombre para tu agente', 'error');
                    return false;
                }
                break;
            case 2:
                const welcomeMessageInput = document.getElementById('welcomeMessage');
                if (!welcomeMessageInput || !welcomeMessageInput.value.trim()) {
                    this.showToast('Por favor, ingresa un mensaje de bienvenida', 'error');
                    return false;
                }
                break;
        }
        return true;
    }

    createNewAgent() {
        if (!this.validateWizardStep(3)) return;

        const agentNameInput = document.getElementById('agentName');
        const agentDescriptionInput = document.getElementById('agentDescription');
        const agentIndustryInput = document.getElementById('agentIndustry');
        const agentToneInput = document.getElementById('agentTone');
        const welcomeMessageInput = document.getElementById('welcomeMessage');
        const agentLanguageInput = document.getElementById('agentLanguage');
        const workingHoursInput = document.getElementById('workingHours');

        if (!agentNameInput || !welcomeMessageInput) return;

        const agentData = {
            id: Date.now(),
            name: agentNameInput.value,
            description: agentDescriptionInput ? agentDescriptionInput.value || 'Agente IA personalizado' : 'Agente IA personalizado',
            industry: agentIndustryInput ? agentIndustryInput.value : 'other',
            tone: agentToneInput ? agentToneInput.value : 'friendly',
            welcomeMessage: welcomeMessageInput.value,
            language: agentLanguageInput ? agentLanguageInput.value : 'es',
            channels: Array.from(document.querySelectorAll('#agentConfigForm input[type="checkbox"]:checked')).map(cb => cb.value),
            workingHours: workingHoursInput ? workingHoursInput.value : '24/7',
            status: 'active',
            conversations: 0,
            resolution_rate: 0,
            avg_response_time: '0min',
            faqs: [
                {
                    id: 1,
                    question: '¿En qué puedo ayudarte?',
                    answer: 'Estoy aquí para ayudarte con cualquier consulta que tengas. ¡Pregúntame lo que necesites!',
                    category: 'General'
                }
            ]
        };

        this.agents.push(agentData);
        this.showToast(`Agente "${agentData.name}" creado exitosamente`, 'success');
        this.showSection('agents');
    }

    // Test Chat
    sendTestMessage() {
        const input = document.getElementById('testChatInput');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        this.addTestChatMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = this.generateBotResponse(message);
            this.addTestChatMessage(response, 'bot');
        }, 1000);
    }

    addTestChatMessage(content, type) {
        const chatMessages = document.getElementById('testChatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateBotResponse(userMessage) {
        const responses = [
            'Gracias por tu consulta. Estoy procesando tu solicitud...',
            'Entiendo tu pregunta. Déjame ayudarte con eso.',
            'Excelente pregunta. Aquí tienes la información que necesitas.',
            'He encontrado la información relevante para tu consulta.',
            '¡Por supuesto! Puedo ayudarte con eso.'
        ];

        // Simple keyword matching for demo
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('horario') || lowerMessage.includes('hora')) {
            return 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM.';
        } else if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
            return 'Puedes consultar nuestros precios en la sección de productos. ¿Te interesa algún producto en particular?';
        } else if (lowerMessage.includes('envío') || lowerMessage.includes('entrega')) {
            return 'Realizamos envíos a toda España con entrega en 24-48 horas. El envío es gratuito para pedidos superiores a 50€.';
        } else if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono')) {
            return 'Puedes contactarnos al teléfono 900 123 456 o escribirnos a info@ejemplo.com.';
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }

    sendDemoMessage() {
        const input = document.getElementById('demoInput');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        this.addDemoChatMessage(message, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.generateBotResponse(message);
            this.addDemoChatMessage(response, 'bot');
        }, 1000);
    }

    // Charts and Analytics
    initializeCharts() {
        if (this.currentSection !== 'analytics') return;

        // Messages Chart
        const messagesCtx = document.getElementById('messagesChart');
        if (messagesCtx && !messagesCtx.chart) {
            messagesCtx.chart = new Chart(messagesCtx, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Mensajes',
                        data: [65, 78, 90, 81, 95, 43, 32],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Resolution Chart
        const resolutionCtx = document.getElementById('resolutionChart');
        if (resolutionCtx && !resolutionCtx.chart) {
            resolutionCtx.chart = new Chart(resolutionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Resueltas', 'Derivadas', 'Sin respuesta'],
                    datasets: [{
                        data: [87, 10, 3],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    // Utility Functions
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${this.getToastIcon(type)}</strong>
                <span>${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    // Form Validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }
}

// Initialize the application
const app = new ChatzIA();