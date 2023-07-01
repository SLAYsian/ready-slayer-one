const router = require('express').Router();
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');
const classRoutes = require('./classRoutes');
const characterRoutes = require('./characterRoutes');

router.use('/users', userRoutes);
router.use('/game', gameRoutes);
router.use('/class', classRoutes)
router.use('/character', characterRoutes)

module.exports = router;
