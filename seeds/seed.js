const sequelize = require('../config/connection');
const { User, Character, CharacterClass, Quest, Outcome, CharacterQuest } = require('../models');

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

  const characterClasses = await CharacterClass.bulkCreate(characterClassData);

  const characters = await Character.bulkCreate(characterData);

  const quests = await Quest.bulkCreate(questData);

  for (const character of characters) {
    // Assign each character to a random quest
    await CharacterQuest.create({
      character_id: character.id,
      quest_id: quests[Math.floor(Math.random() * quests.length)].id,
    });
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
