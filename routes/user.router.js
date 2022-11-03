const { Router } = require('express');
const { check } = require('express-validator')
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/field-validator');
const { create, update, remove, list, getByEmail, getById } = require('../controllers/user.controller');

const router = Router();

router.post('/api/user', [
    check('name', 'Name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty(),
    check('role', 'Role is required').notEmpty().isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),
    validateFields
], create);

router.put('/api/user/:id', validateJWT, update);

router.delete('/api/user/:id', validateJWT, remove);

router.get('/api/user', validateJWT, list);

router.get('/api/user/:id', validateJWT, getById);

router.get('/api/user/byEmail/:email', validateJWT, getByEmail);

module.exports = router;