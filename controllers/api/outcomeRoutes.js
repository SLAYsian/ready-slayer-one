const router = require('express').Router();
const {
  Character,
  Quest,
  Outcome,
  CharacterClass,
  User,
} = require('../../models');

router.post('/lose', async (req, res) => {
  try {
    //there is an outcome type because there are multiple ways to lose
    const outcomeType = req.body.outcomeType;
    const outcomeData = await Outcome.create({
      outcome: 'lose',
      outcomeType: outcomeType,
    });

    res.status(200).json(outcomeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/success', async (req, res) => {
  try {
    const outcomeData = await Outcome.create({
      outcome: 'success',
    });

    res.status(200).json(outcomeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/save', async (request, response) => {
  const { name, description, character_id, quest_id, user_id } = request.body;

  try {
    let [outcome, created] = await Outcome.findOrCreate({
      where: { quest_id: quest_id, user_id: user_id },
      defaults: {
        name: name,
        description: description,
        character_id: character_id,
      },
    });

    if (!created) {
      outcome.name = name;
      outcome.description = description;
      outcome.character_id = character_id;
      await outcome.save();
    }

    response.status(201).json(outcome);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
