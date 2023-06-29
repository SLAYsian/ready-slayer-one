document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('character-form');
    const genreSelect = document.getElementById('genre-select');
    const classSelect = document.getElementById('class-select');
  
    // Add an event listener to the genre select element
    genreSelect.addEventListener('change', () => {
      const selectedGenre = genreSelect.value;
      
      // Show/hide the class options based on the selected genre
      if (selectedGenre === 'Fantasy') {
        classSelect.options[0].style.display = 'block';
        classSelect.options[1].style.display = 'none';
        classSelect.options[2].style.display = 'block';
      } else if (selectedGenre === 'Sci-Fi') {
        classSelect.options[0].style.display = 'none';
        classSelect.options[1].style.display = 'block';
        classSelect.options[2].style.display = 'block';
      }
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const genre = genreSelect.value;
      const name = document.getElementById('character-name').value;
      const characterClass = classSelect.value;
  
      fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre, name, characterClass }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          renderStartingScenarios(data.scenarios);
        })
        .catch((error) => {
          // Handle any errors
          console.log(error);
        });
    });
  
    const renderStartingScenarios = (scenarios) => {
        const scenarioSection = document.createElement('section');
        scenarioSection.id = 'scenario-section';
      
        const heading = document.createElement('h2');
        heading.textContent = 'Starting Scenarios';
      
        const scenarioList = document.createElement('ul');
      
        scenarios.forEach((scenario) => {
          const listItem = document.createElement('li');
          const scenarioName = document.createElement('h3');
          scenarioName.textContent = scenario.name;
          const scenarioDescription = document.createElement('p');
          scenarioDescription.textContent = scenario.description;
      
          listItem.appendChild(scenarioName);
          listItem.appendChild(scenarioDescription);
          scenarioList.appendChild(listItem);
        });
      
        scenarioSection.appendChild(heading);
        scenarioSection.appendChild(scenarioList);
      
        const formParent = form.parentElement;
        formParent.appendChild(scenarioSection);
        form.style.display = 'none';
      };
      
  });
  