document.addEventListener('DOMContentLoaded', () => {
  const questId = localStorage.getItem('questId');
  const characterId = localStorage.getItem('characterId');
  let userId = localStorage.getItem('userId');
  const sessionId = localStorage.getItem('sessionId');

  const chatController = {
    characterData: null,
    userId: null,

    async init(characterData) {
      this.characterData = characterData;
      this.userId = userId;
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
        role: 'User',
        content: message,
      };
      this.appendChatMessage(chatMessage);

      fetch('/api/game/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sessionId, input: message }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(`sendMessage response: ${JSON.stringify(data)}`);
          const responseMessage = {
            role: 'Narrator',
            content: data.output.content,
          };
          this.appendChatMessage(responseMessage);
          typingIndicator.style.display = 'none';
          chatSection.scrollTop = chatSection.scrollHeight;
          this.saveOutcome(
            'Chat History',
            JSON.stringify(chatSection.innerHTML)
          );
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

    saveOutcome(name, chat_history) {
      let userId = this.userId;
      if (userId === 'null' || userId === '') {
        userId = null;
      }

      const payload = {
        name: name || '',
        chat_history: chat_history || [],
        character_id: characterId,
        quest_id: questId,
        session_id: sessionId,
        user_id: userId,
      };
      console.log(`saveOutcome payload: ${JSON.stringify(payload)}`);

      fetch('/api/outcome/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(`saveOutcome response: ${JSON.stringify(data)}`);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    },
    
    async initialRequest() {
      try {
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.style.display = 'block';
        const prompt = this.generateStartingPrompt();
        const response = await fetch('/api/game/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: sessionId, input: prompt }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const responseMessage = {
          role: 'Narrator',
          content: data.output.content,
        };
        this.appendChatMessage(responseMessage);
        this.saveOutcome('Initial Prompt', prompt, questId);
        loadingMessage.style.display = 'none';
      } catch (error) {
        console.error('Error:', error);
      }
    },

    generateStartingPrompt() {
      const character = this.characterData;
      let prompt = `The player is ${character.name}, a valiant ${character.character_class.name} embarking on an epic adventure. `;
      prompt += `Here's a glimpse of their abilities:\n`;
      prompt += `Strength: ${character.strength} - The raw physical power they wield.\n`;
      prompt += `Agility: ${character.agility} - Their speed and dexterity.\n`;
      prompt += `Intelligence: ${character.intelligence} - Their ability to learn and reason.\n`;
      prompt += `Wisdom: ${character.wisdom} - Their insight and perception of the world.\n`;
      prompt += `Charisma: ${character.charisma} - Their charm and ability to lead.\n`;
      prompt += `Constitution: ${character.constitution} - Their endurance and health.\n`;
      prompt += `\n`;
      prompt += `Their journey begins with the quest "${character.quests[0].name}".\n`;
      prompt += `Quest Details: ${character.quests[0].description}\n`;
      prompt += `Set in the genre of ${character.quests[0].genre}, this quest will test their mettle and wits.\n`;
      prompt += `As the narrator, your task is to guide ${character.name} through this journey. You must describe a starting point where the player can begin the quest and act as the narrator in response to their prompts.\n`;
      prompt += `Be lightly descriptive but do not exceed 200 characters for any message. Let's begin...\n`;
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
      console.log(`getCharacterData response: ${JSON.stringify(characterData)}`);
      return characterData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const initializeChatController = async () => {
    try {
      const characterData = await getCharacterData();
      chatController.init(characterData, userId);
    } catch (error) {
      console.error('Error initializing chat controller:', error);
    }
  };

  initializeChatController();
});