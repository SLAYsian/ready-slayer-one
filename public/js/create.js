document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('character-form');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const genre = document.getElementById('genre-select').value;
      const name = document.getElementById('character-name').value;
      const characterClass = document.getElementById('class-select').value;
  
      fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre, name, characterClass }),
      })
        .then((response) => response.json())
        .then((data) => {
          renderStartingScenarios(data.scenarios);
        })
        .catch((error) => {
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
        listItem.innerHTML = `
          <h3>${scenario.name}</h3>
          <p>${scenario.description}</p>
        `;
        scenarioList.appendChild(listItem);
      });
  
      scenarioSection.appendChild(heading);
      scenarioSection.appendChild(scenarioList);
  
      form.parentElement.appendChild(scenarioSection);
      form.style.display = 'none';
    };
  });
  