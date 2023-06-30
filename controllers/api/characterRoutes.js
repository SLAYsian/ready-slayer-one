const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
const { Character, Quest, Outcome, CharacterClass, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/class/:id', withAuth, async (req, res) => {
    // The existing route logic
  });
  

module.exports = router;
