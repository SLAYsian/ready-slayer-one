document.addEventListener('DOMContentLoaded', () => {
  const storedScenario = localStorage.getItem('quest');
  const quest  = storedScenario ? JSON.parse(storedScenario) : null;
  console.log(quest);
  const storedCharacter = localStorage.getItem('character');
  const character = storedCharacter ? JSON.parse(storedCharacter) : null;
  console.log(character);
  const chatController = {
    init() {
      this.bindEvents();
    },
  
    bindEvents() {
      const form = document.getElementById('chat-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
          this.sendMessage(message);
          messageInput.value = '';
        }
      });
    },
  
    sendMessage(message) {
      const chatSection = document.getElementById('chat-section');
      const typingIndicator = document.getElementById('typing-indicator');
      
      typingIndicator.style.display = 'block';
      chatSection.scrollTop = chatSection.scrollHeight;
  
      const chatMessage = {
        role: 'user',
        content: message
      };
      this.appendChatMessage(chatMessage);
  
      fetch('/api/game/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId, input: message }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const responseMessage = {
            role: 'ai',
            content: data.output.content
          };
          this.appendChatMessage(responseMessage);
          typingIndicator.style.display = 'none';
          chatSection.scrollTop = chatSection.scrollHeight;
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    },
  
    appendChatMessage(message) {
      const chatSection = document.getElementById('chat-section');
      const chatMessage = document.createElement('p');
      chatMessage.classList.add(message.role);
      chatMessage.innerHTML = `
        <span><b>${message.role}</b></span>
        <span>:</span>
        <span>${message.content}</span>
      `;
      chatSection.appendChild(chatMessage);
    },
  };
  chatController.init();
});
