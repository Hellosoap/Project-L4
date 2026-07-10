const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cartControllers');

router.route('/')
    .post(cartControllers.addCart)

router.route('/:id')
    .get(cartControllers.getCart)
    .delete(cartControllers.removeCart)
    .patch(cartControllers.updateCart)

module.exports = router;