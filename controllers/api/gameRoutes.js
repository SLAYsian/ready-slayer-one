const openai = require('../../config/openai');
const router = require('express').Router();
const {
  Character,
  Outcome,
} = require('../../models');

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

  if (!Array.isArray(history)) {
    console.error('History is not an array:', history);
    return response.status(500).json({ message: 'Server error' });
  }

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'user', content: input_text });
    if (completion_text === undefined) {
      return res.status(404).json({ message: `Warning: completion_text is undefined for input_text: ${input_text}` });
    }
    messages.push({ role: 'assistant', content: completion_text });
  }
  messages.push({ role: 'user', content: input });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;

    history.push([input, completion_text]);

    outcome.chat_history = history;
    await outcome.save();

    response.json({ output: { content: completion_text } });
  } catch (error) {
    if (error.response) {
      response.status(500).json({ message: 'Error from OpenAI API' });
    } else {
      response.status(500).json({ message: 'Server error' });
    }
  }
});


router.post('/create', async (request, response) => {
  const { name, description, character_id, user_id, quest_id, chat_history } = request.body;

  try {
    let [outcome, created] = await Outcome.findOrCreate({
      where: { character_id: character_id },
      defaults: {
        name: name,
        description: description,
        character_id: character_id,
        quest_id: quest_id,
      },
    });

    if (!created) {
      outcome.name = name;
      outcome.chat_history = chat_history;
      outcome.character_id = character_id;
      if (user_id !== null) {
        outcome.user_id = user_id;

        const character = await Character.findByPk(character_id);
        if (character) {
          character.user_id = user_id;
          await character.save();
        }
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