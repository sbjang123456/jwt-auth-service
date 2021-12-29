'use strict';

const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/token/issuance', controller.issueToken);
router.post('/token/reissuance', controller.reissueToken);
router.post('/token/verification', controller.verifyToken);

module.exports = router;