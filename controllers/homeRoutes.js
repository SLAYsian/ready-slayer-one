const router = require('express').Router();
const { Model, DataTypes } = require('sequelize');
const { User, Outcome, Character, Quest } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const latestOutcomes = await Outcome.findAll({
      order: [['date_created', 'DESC']],
      limit: 5,
    });

    const outcomes = latestOutcomes.map(outcome => outcome.get({ plain: true }));

    res.render('homepage', {
      outcomes,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/game', async (req, res) => {
  try {
    res.render('game', { 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });

    let userCharacters = await Character.findAll({
      where: { user_id: req.session.user_id },
      attributes: ['name', 'avatar', 'id']
    });

    let userOutcomes = await Outcome.findAll({
      where: { user_id: req.session.user_id },
      attributes: ['name', 'description', 'id', 'character_id']
    });

    userCharacters = userCharacters.map(character => character.get({ plain: true }));
    userOutcomes = userOutcomes.map(outcome => {
      const plainOutcome = outcome.get({ plain: true });
      const character = userCharacters.find(character => character.id === plainOutcome.character_id);
      console.log('Outcome:', plainOutcome);
      console.log('Found Character:', character);
      plainOutcome.character = character ? { ...character } : null;
      return plainOutcome;
    });
    

    console.log('User:', user);
    console.log('User Outcomes:', userOutcomes);
    console.log('User Characters:', userCharacters);

    res.render('profile', {
      ...user,
      userOutcomes,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/create', async (req, res) => {
  try {
    res.render('create', { 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('signup');

});
module.exports = router;
