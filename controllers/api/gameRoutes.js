const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
const { Character, Quest, Outcome, CharacterClass, User } = require('../../models');
const withAuth = require('../../utils/auth');

const configuration = new Configuration({
  organization: process.env.OPENAI_COMPANYID,
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (request, response) => {
  const { chats } = request.body;

  try {
    const character = await Character.findByPk(chats[0].characterId, {
      include: [
        { model: CharacterClass, as: 'character_class' },
        { model: User, as: 'user', attributes: ['name', 'email'] },
      ],
    });

    if (!character) {
      throw new Error('Character not found');
    }

    let systemMessage = `You are ${character.name}, a ${character.character_class.name} embarking on a quest. Your attributes are: strength ${character.character_class.strength}, agility ${character.character_class.agility}, constitution ${character.character_class.constitution}, wisdom ${character.character_class.wisdom}, intelligence ${character.character_class.intelligence}, charisma ${character.character_class.charisma}.`;

    if (!character.user) {
      systemMessage += ' No user is attached to this character.';
    }

    const messages = [
      {
        role: 'system',
        content: systemMessage,
      },
      ...chats.slice(1).map((chat) => ({ role: chat.role, content: chat.content })),
    ];

    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    response.json({
      output: {
        content: result.data.choices[0].message,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { genre, name, class: characterClass } = req.body;

    const character = await Character.create({ name, class: characterClass });

    const scenarios = await Quest.findAll({ where: { genre } });

    res.render('startingScenarios', { character, genre, scenarios });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
