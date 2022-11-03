const { Router } = require('express');
const { check } = require('express-validator')
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/field-validator');
const { create, update, remove, list, getByEmail, getById } = require('../controllers/user.controller');

const router = Router();

router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty(),
    check('role', 'Role is required').notEmpty().isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),
    validateFields
], create);

router.put('/:id', validateJWT, update);

router.delete('/:id', validateJWT, remove);

router.get('/', validateJWT, list);

router.get('/:id', validateJWT, getById);

router.get('/byEmail/:email', validateJWT, getByEmail);

module.exports = router;