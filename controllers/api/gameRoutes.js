const openai = require('../../config/openai');
const router = require('express').Router();
const {
  Character,
  Quest,
  Outcome,
  CharacterClass,
  User,
} = require('../../models');
const withAuth = require('../../utils/auth');
const getCharacterData = require('../../utils/getCharacterData');

let history = [];

router.post('/chat', async (request, response) => {
  const { gameId, input } = request.body;

  let [outcome, created] = await Outcome.findOrCreate({
    where: { session_id: gameId },
    defaults: { chat_history: [] },
  });

  let history = outcome.chat_history;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'user', content: input_text });
    messages.push({ role: 'assistant', content: completion_text });
  }

  messages.push({ role: 'user', content: input });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);

    history.push([input, completion_text]);

    outcome.chat_history = history;
    await outcome.save();

    response.json({ output: { content: completion_text } });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      response.status(500).json({ message: 'Error from OpenAI API' });
    } else {
      console.log(error.message);
      response.status(500).json({ message: 'Server error' });
    }
  }
});

router.post('/create', async (req, res) => {
  try {
    const { genre, name, class: className } = req.body;
    const characterClass = await CharacterClass.findOne({
      where: { name: className },
    });
    if (!characterClass) {
      throw new Error('Character class not found');
    }
    const character = await Character.create(
      { name, class_id: characterClass.id },
      {
        include: [{ model: CharacterClass, as: 'character_class' }],
      }
    );
    const scenarios = await Quest.findAll({ where: { genre } });
    res.json({ character, class: characterClass.name, genre, scenarios });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
