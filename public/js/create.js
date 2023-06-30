document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('character-form');
  const genreSelect = document.getElementById('genre-select');
  const classSelect = document.getElementById('class-select');

  let characterName = null;
  let characterClass = null;
  let characterStats = null;
  let scenarios = null;

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

    fetch('/api/game/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ genre, name: characterName, class: characterClass }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        characterStats = data.character.character_class;
        renderStartingScenarios(data.scenarios);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const renderStartingScenarios = (scenarioData) => {
    scenarios = scenarioData;
    const scenarioSection = document.createElement('section');
    scenarioSection.id = 'scenario-section';

    const heading = document.createElement('h2');
    heading.textContent = 'Starting Scenarios';

    const scenarioList = document.createElement('form'); 
    scenarioList.id = 'scenario-form';  

    scenarios.forEach((scenario, index) => { 
      const listItem = document.createElement('div'); 

      const radioButton = document.createElement('input');
      radioButton.type = 'radio';
      radioButton.name = 'scenario';
      radioButton.value = scenario.id; 
      radioButton.id = `scenario${index}`;

      const label = document.createElement('label');  
      label.htmlFor = `scenario${index}`;

      const scenarioName = document.createElement('h3');
      scenarioName.textContent = scenario.name;

      const scenarioDescription = document.createElement('p');
      scenarioDescription.textContent = scenario.description;

      label.appendChild(scenarioName); 
      label.appendChild(scenarioDescription);
      listItem.appendChild(radioButton); 
      listItem.appendChild(label);
      scenarioList.appendChild(listItem);
    });

    const submitButton = document.createElement('button'); 
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    scenarioList.appendChild(submitButton); 

    scenarioSection.appendChild(heading);
    scenarioSection.appendChild(scenarioList);

    const formParent = form.parentElement;
    formParent.appendChild(scenarioSection);
    form.style.display = 'none';

    scenarioList.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGameLaunch(e);
    });
  };

  const handleGameLaunch = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    const selectedGenre = genreSelect.value;
    const selectedClass = classSelect.value;
  
    const selectedScenarioRadio = document.querySelector('input[name="scenario"]:checked');
  
    if (!selectedScenarioRadio) {
      console.log('No scenario selected');
      return;
    }
    
    const selectedClassId = classSelect.value;
    const selectedScenarioId = selectedScenarioRadio.value;
    const selectedScenario = scenarios.find((scenario) => scenario.id == selectedScenarioId);
  
    if (!selectedScenario) {
      console.log('Selected scenario not found');
      return;
    }
    
    const character = {
      name: characterName,
      classId: selectedClassId,
    };
  
    console.log(character);

    try {
      characterClass = await CharacterClass.findOne({ where: { name: character.class } });
  
      if (!characterClass) {
        console.log('Character class not found');
        return;
      }
    } catch (error) {
      console.log('Error retrieving character class:', error);
      return;
    }
  
    const attributes = {
      strength: characterClass.strength,
      agility: characterClass.agility,
      constitution: characterClass.constitution,
      wisdom: characterClass.wisdom,
      intelligence: characterClass.intelligence,
      charisma: characterClass.charisma,
    };

    console.log(attributes);
  
    const quest = {
      name: selectedScenario.name,
      description: selectedScenario.description,
      genre: genreSelect.value,
    };

    console.log(quest);
  
    const userMessage = `I am ${character.name}, a ${character.class} with attributes: strength ${attributes.strength}, agility ${attributes.agility}, constitution ${attributes.constitution}, wisdom ${attributes.wisdom}, intelligence ${attributes.intelligence}, charisma ${attributes.charisma}. The selected scenario is ${quest.name}.`;
  
    const assistantMessage = `You are ${character.name}, a ${character.class} embarking on a quest. Your attributes are: strength ${attributes.strength}, agility ${attributes.agility}, constitution ${attributes.constitution}, wisdom ${attributes.wisdom}, intelligence ${attributes.intelligence}, charisma ${attributes.charisma}.`;
  
    const chats = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantMessage },
    ];
  
    const data = { chats };
  
    try {
      const response = await fetch('/api/game/process-chat', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        console.log('An error occurred');
        return;
      }
  
      const result = await response.json();
      console.log(result.output.content);
      window.location.href = result.gameUrl;
    } catch (error) {
      console.log(error);
    }
  };
});
