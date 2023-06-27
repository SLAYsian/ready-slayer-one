const sequelize = require('../config/connection');
const { User, Character, CharacterClass, Quest, Outcome } = require('../models');

const userData = require('./userData.json');
const characterData = require('./characterData.json');
const characterClassData = require('./characterClass.json');
const questData = require('./questData.json');
const outcomeData = require('./outcomeData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const characters = await Character.bulkCreate(characterData);
  
  const characterClasses = await CharacterClass.bulkCreate(characterClassData);

  const quests = []; 

  for (const quest of questData) {
    const createdQuest = await Quest.create({
      ...quest,
      character_id: characters[Math.floor(Math.random() * characters.length)].id,
    });
    
    quests.push(createdQuest); 
  }

  for (const outcome of outcomeData) {
    await Outcome.create({
      ...outcome,
      character_id: characters[Math.floor(Math.random() * characters.length)].id,
      quest_id: quests[Math.floor(Math.random() * quests.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
