const delButtonHandler = async (event) => {
  const outcomeId = event.target.getAttribute('data-id');
  const characterId = event.target.getAttribute('data-character-id');

  const confirmed = confirm('Are you sure you want to delete this outcome and character?');

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/outcome/${outcomeId}`, {
      method: 'DELETE',
    });

    const response2 = await fetch(`/api/character/${characterId}`, {
      method: 'DELETE',
    });

    if (response.ok && response2.ok) {
      document.location.replace('/profile');
    } else {
      throw new Error('Failed to delete outcome and character');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to delete outcome and character');
  }
};


const deleteButtons = document.getElementsByClassName('delete-button');
Array.from(deleteButtons).forEach((button) => {
  button.addEventListener('click', delButtonHandler);
});

const pastGameFinder = async (event) => {
  const outcomeId = event.target.getAttribute('data-id');

  try {
    const response = await fetch(`/api/outcome/${outcomeId}`, {
      method: 'get',
    });

    if (response.ok) {
      window.location.href = `/pastgame/${outcomeId}`;
    } else {
      throw new Error('Failed to fetch game history');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to fetch game history');
  }
};

const viewGameButtons = document.getElementsByClassName('viewGame-button');
Array.from(viewGameButtons).forEach((button) => {
  button.addEventListener('click', pastGameFinder);
});

const renderChatHistory = (chatHistory) => {
  const chatHistoryContainer = document.querySelector('.chat-history');

  if (!chatHistoryContainer) {
    console.error('Chat history container not found');
    return;
  }

  chatHistoryContainer.innerHTML = '';

  const ul = document.createElement('ul');

  chatHistory.forEach((message) => {
    const li = document.createElement('li');
    li.textContent = message.message;
    ul.appendChild(li);
  });

  chatHistoryContainer.appendChild(ul);
};