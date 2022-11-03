const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/field-validator');
const { create, update, remove, list, getPokemon } = require('../controllers/pokemon.controller');

const router = Router();

router.post('/api/pokemon', [
    check('name', 'Name is required').notEmpty(),
    check('weight', 'Weight is required').notEmpty(),
    check('height', 'Height is required').notEmpty(),
    check('base_experience', 'Base experience is required').notEmpty(),
    check('types', 'Types array is required. Format: [{slot: number, type: {name: string}}]').notEmpty(),
    validateFields
], create);

router.put('/api/pokemon/:idParam', validateJWT, update);

router.delete('/api/pokemon/:idParam', validateJWT, remove);

router.get('/api/pokemon', validateJWT, list);

router.get('/api/pokemon/:param', validateJWT, getPokemon);

module.exports = router;