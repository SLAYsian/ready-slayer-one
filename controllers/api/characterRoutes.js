const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
const { Character, Quest, Outcome, CharacterClass, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const characterClasses = await CharacterClass.findAll();
    res.status(200).json(characterClasses);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const characterClass = await CharacterClass.findByPk(req.params.id);

    if (!characterClass) {
      res.status(404).json({ message: 'No character class found with this id!' });
      return;
    }

    res.status(200).json(characterClass);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; 
