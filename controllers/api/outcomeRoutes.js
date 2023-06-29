const router = require('express').Router();
const { Outcome } = require('../models');

router.post('/outcome/lose', async (req, res) => {
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


router.post('/outcome/success', async (req, res) => {
    try {
      const outcomeData = await Outcome.create({
        outcome: 'success',
      });
  
      res.status(200).json(outcomeData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;