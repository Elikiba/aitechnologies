// AI Chatbot Functionality
(function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    let isOpen = false;

    function toggleChatbot() {
        isOpen = !isOpen;
        chatbotWindow.classList.toggle('open', isOpen);
        chatbotToggle.classList.toggle('active', isOpen);
        chatbotWindow.setAttribute('aria-hidden', !isOpen);
        
        if (isOpen) {
            chatbotInput.focus();
        }
    }

    function closeChatbot() {
        isOpen = false;
        chatbotWindow.classList.remove('open');
        chatbotToggle.classList.remove('active');
        chatbotWindow.setAttribute('aria-hidden', 'true');
    }

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function sendMessage(message) {
        if (!message.trim()) return;

        addMessage(message, true);
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        
        addTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            addMessage(data.reply);
        } catch (error) {
            removeTypingIndicator();
            addMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment or contact us directly at hello@aitechafrica.com');
        } finally {
            chatbotInput.disabled = false;
            chatbotInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);

    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(chatbotInput.value);
    });

    quickReplies.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            sendMessage(message);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeChatbot();
        }
    });

    document.addEventListener('click', (e) => {
        if (isOpen && !chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
            closeChatbot();
        }
    });
})();