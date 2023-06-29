document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatSection = document.getElementById('chat-section');
    const typingIndicator = document.getElementById('typing-indicator');
  
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
  
      fetch('http://localhost:3001/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chats }),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            appendChatMessage({ role: 'ai', content: data.output.content });
            typingIndicator.style.display = 'none';
          chatSection.scrollTop = chatSection.scrollHeight;
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const appendChatMessage = (message) => {
        const p = document.createElement('p');
        p.classList.add(message.role === 'user' ? 'user_msg' : 'ai_msg');
        p.innerHTML = `<b>${message.role.toUpperCase()}</b>: ${message.content}`;
        chatSection.appendChild(p);
      };
      
      form.addEventListener('submit', chat);
    });      