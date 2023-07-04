document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/users/user')
    .then((response) => response.json())
    .then((data) => {
      const userId = data.user_id || null;
      localStorage.setItem('userId', userId);
    })
    .catch((error) => console.error('Error:', error));

  const form = document.getElementById('character-form');
  const genreSelect = document.getElementById('genre-select');
  const classSelect = document.getElementById('class-select');

  let characterName = null;
  let characterClass = null;
  let scenarios = null;
  let currentCharacter = null;

  const genreOptions = {
    Fantasy: [
      { value: 'wizard', label: 'Wizard' },
      { value: 'rogue', label: 'Rogue' },
      { value: 'warrior', label: 'Warrior' },
    ],
    'Sci-Fi': [
      { value: 'soldier', label: 'Soldier' },
      { value: 'engineer', label: 'Engineer' },
      { value: 'scientist', label: 'Scientist' },
    ],
  };

  const populateClassOptions = () => {
    const selectedGenre = genreSelect.value;

    classSelect.innerHTML = '';

    genreOptions[selectedGenre].forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      classSelect.appendChild(optionElement);
    });
  };

  genreSelect.addEventListener('change', () => {
    populateClassOptions();
  });

  populateClassOptions();

  genreSelect.addEventListener('change', () => {
    const selectedGenre = genreSelect.value;

    classSelect.innerHTML = '';

    genreOptions[selectedGenre].forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      classSelect.appendChild(optionElement);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const genre = genreSelect.value;
    characterName = document.getElementById('character-name').value;
    characterClass = classSelect.value;

    fetch('/api/character/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        genre,
        name: characterName,
        class: characterClass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        renderStartingScenarios(data);
        // 
        // renderGenreCharacter(input);
      })
      .then((updatedCharacter) => {
        console.log('Character updated:', updatedCharacter);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const fetchCharacterClass = async (classId) => {
    try {
      const response = await fetch(`/api/class/${classId}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching character class data: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error retrieving character class: ${error}`);
      return null;
    }
  };

  const updateCharacterAttributes = async (character) => {
    const characterClass = await fetchCharacterClass(character.classId);

    const attributes = {
      strength: (characterClass.strength || 0) + (character.strength || 0),
      agility: (characterClass.agility || 0) + (character.agility || 0),
      constitution:
        (characterClass.constitution || 0) + (character.constitution || 0),
      wisdom: (characterClass.wisdom || 0) + (character.wisdom || 0),
      intelligence:
        (characterClass.intelligence || 0) + (character.intelligence || 0),
      charisma: (characterClass.charisma || 0) + (character.charisma || 0),
    };

    const response = await fetch(
      `/api/character/update/${character.characterId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributes),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update character');
    }

    const updatedCharacter = await response.json();
    return updatedCharacter;
  };

  // NOTES: UPDATED
  // const renderGenreCharacter = () => {
  //   let genre = document.querySelector('.genre');
  //   genre.textContent = `Genre: ${genreSelect.value}`;
  // }

  const renderStartingScenarios = (scenarioData) => {
    scenarios = scenarioData.scenarios;
    currentCharacter = scenarioData.character;
    currentClass = scenarioData.class;

    const modal = document.querySelector('.modal');
    modal.classList.remove('modal');

    const scenarioSection = document.createElement('section');
    scenarioSection.id = 'scenario-section';

    const heading = document.querySelector('.create-heading');
    heading.textContent = 'Starting Scenarios'

    const scenarioList = document.createElement('form');
    scenarioList.id = 'scenario-form';
    scenarioList.action = './game';
    scenarioList.classList.add('mt-4')

      // NOTES: 2 columns
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      
    scenarios.forEach((scenario, index) => {
      const listItem = document.createElement('div');
      // NOTES: 2 columns
      listItem.classList.add('col-md-6');

      // const scenarioContainer = document.createElement('div');
      // scenarioContainer.classList.add('scenario-container');

      const label = document.createElement('label');
      // NOTES: Added
      label.classList.add('scenario-label');
      label.htmlFor = `scenario${index}`;

      const radioButton = document.createElement('input');
      radioButton.type = 'radio';
      radioButton.name = 'scenario';
      radioButton.value = scenario.id;
      radioButton.id = `scenario${index}`;

      const scenarioName = document.createElement('span');
      scenarioName.textContent = ` ${scenario.name}`;
      scenarioName.classList.add('scenario-name');
      // const scenarioName = document.createElement('h5');
      // scenarioName.textContent = scenario.name;

      const scenarioDescription = document.createElement('p');
      scenarioDescription.textContent = scenario.description;
   
      label.appendChild(radioButton);
      // scenarioContainer.appendChild(scenarioName);
      // scenarioContainer.appendChild(scenarioDescription);
      label.appendChild(scenarioName);
      // label.appendChild(scenarioDescription);
      // label.appendChild(scenarioContainer)
      // listItem.appendChild(radioButton);
      listItem.appendChild(label);
      listItem.appendChild(scenarioDescription);
      // scenarioList.appendChild(listItem);
      rowDiv.appendChild(listItem);
    });
    // scenarioList.appendChild(rowDiv);

      // NOTES: Added
      const submitButtonDiv = document.createElement('div');
      submitButtonDiv.classList.add('col-12');

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    submitButton.addEventListener('click', handleGameLaunch);

    // NOTES: added
    submitButtonDiv.appendChild(submitButton);
    rowDiv.appendChild(submitButtonDiv);

    scenarioList.appendChild(rowDiv);
    // scenarioList.appendChild(submitButton);
    
    scenarioSection.appendChild(heading);
    scenarioSection.appendChild(scenarioList);

    const formParent = form.parentElement;
    formParent.appendChild(scenarioSection);
    form.style.display = 'none';
  };

  const handleGameLaunch = async (e) => {
    // if (e) {
    //   e.preventDefault();
    // }

    const selectedScenarioRadio = document.querySelector(
      'input[name="scenario"]:checked'
    );

    if (!selectedScenarioRadio) {
      console.log('No scenario selected');
      return;
    }

    const selectedScenarioId = selectedScenarioRadio.value;
    const selectedScenario = scenarios.find(
      (scenario) => scenario.id == selectedScenarioId
    );

    const userId = localStorage.getItem('userId');

    const character = {
      name: currentCharacter.name,
      classId: currentCharacter.class_id,
      className: currentClass,
      characterId: currentCharacter.id,
      attributes: {},
    };

    let characterId = currentCharacter.id;
    let questId = selectedScenario.id;

    localStorage.setItem('characterId', characterId.toString());
    localStorage.setItem('questId', questId.toString());

    fetch('/api/character/addquest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ characterId, questId }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error during adding quest:', error);
      });

      const payload = {
        name: name || '',
        character_id: characterId,
        quest_id: questId,
        session_id: characterId,
        user_id: userId,
      };

      fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('sessionId', data.id);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        try {
          character.attributes = await updateCharacterAttributes(character);
        } catch (error) {
          console.log('Error updating class:', error);
          return;
        }
  };
});
