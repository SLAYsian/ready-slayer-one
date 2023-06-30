const router = require('express').Router();
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');
// const characterRoutes = require('./characterRoutes');

router.use('/users', userRoutes);
router.use('/game', gameRoutes);
// router.use('/character-class', characterRoutes)

module.exports = router;
