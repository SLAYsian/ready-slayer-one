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
  const { sessionId, input } = request.body;

  if (sessionId === undefined) {
    return response.status(400).json({ message: "Session ID is required" });
  }
  
  let [outcome, created] = await Outcome.findOrCreate({
    where: { id: sessionId },
    defaults: { chat_history: [] },
  });

  let history = outcome.chat_history || [];

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

router.post('/create', async (request, response) => {
  const { name, character_id, user_id } = request.body;

  try {
    let [outcome, created] = await Outcome.findOrCreate({
      where: { character_id: character_id },
      defaults: {
        name: name,
        character_id: character_id,
      },
    });

    if (!created) {
      outcome.name = name;
      outcome.chat_history = chat_history;
      outcome.character_id = character_id;
      if (user_id !== null) {
        outcome.user_id = user_id;
      }
      await outcome.save();
    }

    response.status(201).json(outcome);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
