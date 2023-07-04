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

  const messages = [{ role: 'system', content: 'You are the narrator. Do not respond in the first-person. Act as the narrator in response to their prompts. Always end the prompt with a question of what the player would like to do next. If they are stuck or ask for help, make suggestions of what they could do next within the context of the story. Do not go off-topic from the story or let the player deviate.' }];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'system', content: input_text });
    messages.push({ role: 'user', content: completion_text });
  }

  messages.push({ role: 'system', content: input });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200,
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
    const { genre, name, class: className, userId } = req.body;

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

    const outcome = await Outcome.create({
      chat_history: [],
      character_id: character.id,
      quest_id: null,
      session_id: character.id,
      user_id: userId || null,
    });

    res.json({ character, class: characterClass.name, genre, scenarios, session: outcome.id });

  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});


module.exports = router;
