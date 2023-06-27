const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
const { Character, Quest, Outcome } = require('../../models');
const withAuth = require('../../utils/auth');

const configuration = new Configuration({
  organization: process.env.OPENAI_COMPANYID,
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (request, response) => {
  const { character, quest } = request.body;

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are ${character.name}, a ${character.character_class.name} embarking on a quest. Your attributes are: strength ${character.character_class.strength}, agility ${character.character_class.agility}, constitution ${character.character_class.constitution}, wisdom ${character.character_class.wisdom}, intelligence ${character.character_class.intelligence}, charisma ${character.character_class.charisma}.`,
      },
      {
        role: "user",
        content: `Begin quest: ${quest.name}. ${quest.description}`
      },
    ],
  });

  response.json({
    output: result.data.choices[0].message.content,
  });
});

module.exports = router;