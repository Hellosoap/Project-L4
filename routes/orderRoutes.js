const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderControllers');

router.route('/')
    .get(orderControllers.getAll)
    .post(orderControllers.create)

router.route('/:id')
    .get(orderControllers.getOne)

router.route('/:id/status')
    .patch(orderControllers.update)

module.exports = router;