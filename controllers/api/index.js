const router = require('express').Router();
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');
const classRoutes = require('./classRoutes');
const characterRoutes = require('./characterRoutes');
const outcomeRoutes = require('./outcomeRoutes');

router.use('/users', userRoutes);
router.use('/game', gameRoutes);
router.use('/class', classRoutes);
router.use('/character', characterRoutes);
router.use('/outcome', outcomeRoutes);

module.exports = router;
