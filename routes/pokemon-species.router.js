const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getPokemon } = require('../controllers/pokemon-species.controller');

const router = Router();

router.get('/:param', validateJWT, getPokemon);

module.exports = router;