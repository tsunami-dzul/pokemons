const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/field-validator');
const { create, update, remove, list, getPokemon } = require('../controllers/pokemon.controller');

const router = Router();

router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('weight', 'Weight is required').notEmpty(),
    check('height', 'Height is required').notEmpty(),
    check('base_experience', 'Base experience is required').notEmpty(),
    check('types', 'Types array is required. Format: [{slot: number, type: {name: string}}]').notEmpty(),
    validateFields
], create);

router.put('/:idParam', validateJWT, update);

router.delete('/:idParam', validateJWT, remove);

router.get('/', validateJWT, list);

router.get('/:param', validateJWT, getPokemon);

module.exports = router;