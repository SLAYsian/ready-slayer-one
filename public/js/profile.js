  const delButtonHandler = async (event) => {
  const outcomeId = event.target.getAttribute('data-id');
  const characterId = event.target.getAttribute('data-character-id');

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

const viewGameButtons = document.getElementsByClassName('viewGame-button');
Array.from(viewGameButtons).forEach((button) => {
  button.addEventListener('click', (event) => {
    const outcomeId = event.target.getAttribute('data-id');
    console.log('outcomeId:', outcomeId);
    const url = `/outcome/pastgame/${outcomeId}`;
    console.log('url:', url);
    window.location.href = url;
  });
});