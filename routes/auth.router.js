const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { login, renewToken } = require('../controllers/auth.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/api/auth', [
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty(),
    validateFields
], login);

router.get('/api/renew', validateJWT, renewToken);

module.exports = router;