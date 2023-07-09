const getCharacterData = async (characterId) => {
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
      return characterData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  module.exports = getCharacterData;
