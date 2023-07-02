document.addEventListener('DOMContentLoaded', () => {
  const questId = localStorage.getItem('questId');
  const characterId = localStorage.getItem('characterId');
  const userId = sessionStorage.getItem('userId');

  const chatController = {
    characterData: null,

    async init(characterData) {
      this.characterData = characterData;
      this.bindEvents();
      await this.initialRequest();
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
        content: message,
      };
      this.appendChatMessage(chatMessage);
    
      fetch('/api/game/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: characterId, input: message }),
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
            content: data.output.content,
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

    saveOutcome(name, description) {
      fetch('/api/outcome/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || '',
          description: description || '',
          character_id: characterId,
          quest_id: questId,
          user_id: userId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert('Outcome saved successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    },
  
    async initialRequest() {
      try {
        const prompt = this.generateStartingPrompt();
        const response = await fetch('/api/game/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameId: characterId, input: prompt }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
    
        const responseMessage = {
          role: 'ai',
          content: data.output.content,
        };
        this.appendChatMessage(responseMessage);
  
      } catch (error) {
        console.error('Error:', error);
      }
    },
    

    generateStartingPrompt() {
      const character = this.characterData;
      let prompt = `You are playing as ${character.name}, a ${character.character_class.name}.`;
      prompt += ` Your stats are as follows:\n`;
      prompt += `Strength: ${character.strength}\n`;
      prompt += `Agility: ${character.agility}\n`;
      prompt += `Intelligence: ${character.intelligence}\n`;
      prompt += `Wisdom: ${character.wisdom}\n`;
      prompt += `Charisma: ${character.charisma}\n`;
      prompt += `Constitution: ${character.constitution}\n`;
      prompt += `\n`;
      prompt += `You have embarked on the quest "${character.quests[0].name}".\n`;
      prompt += `Description: ${character.quests[0].description}\n`;
      prompt += `Genre: ${character.quests[0].genre}\n`;
      return prompt;
    },
  };

  const getCharacterData = async () => {
    try {
      const response = await fetch(`/api/character/${characterId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const characterData = await response.json();
      console.log(characterData);
      return characterData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const initializeChatController = async () => {
    try {
      const characterData = await getCharacterData();
      chatController.init(characterData);
    } catch (error) {
      console.error('Error initializing chat controller:', error);
    }
  };
  
  initializeChatController();
});
