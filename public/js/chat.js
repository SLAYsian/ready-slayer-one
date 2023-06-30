document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatSection = document.getElementById('chat-section');
    const typingIndicator = document.getElementById('typing-indicator');
    let lastChatId = null;
  
    const chat = async (e) => {
      e.preventDefault();
    
      const message = messageInput.value;
      if (!message) return;
    
      typingIndicator.style.display = 'block';
      chatSection.scrollTop = chatSection.scrollHeight;
    
      const chats = Array.from(chatSection.children).map((chatMessage) => {
        const role = chatMessage.classList.contains('user_msg') ? 'user' : 'ai';
        const content = chatMessage.innerText.split(': ')[1];
        return { role, content };
      });
    
      chats.push({ role: 'user', content: message });
      appendChatMessage({ role: 'user', content: message });
    
      messageInput.value = '';
    
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
          appendChatMessage({ role: 'ai', content: data.output.content });
          typingIndicator.style.display = 'none';
          chatSection.scrollTop = chatSection.scrollHeight;
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    };
    
  
    const appendChatMessage = (message) => {
      const p = document.createElement('p');
      p.classList.add(message.role === 'user' ? 'user_msg' : 'ai_msg');
      p.innerHTML = `<b>${message.role.toUpperCase()}</b>: ${message.content}`;
      chatSection.appendChild(p);
      lastChatId = message.id;
    };
  
    const fetchNewMessages = () => {
      fetch(`http://localhost:3001/api/game/${gameId}/chat?lastChatId=${lastChatId}`)
        .then(response => response.json())
        .then(chatData => {
          chatData.forEach(chatMessage => {
            appendChatMessage(chatMessage);
          });
          chatSection.scrollTop = chatSection.scrollHeight;
        })
        .catch(error => console.log(error));
    };
  
    setInterval(fetchNewMessages, 5000);
  
    form.addEventListener('submit', chat);
  });