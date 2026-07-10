const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');

router.route('/')
    .get(productControllers.getAll)
    .post(productControllers.create)

router.route('/:id')
    .get(productControllers.getOne)
    .delete(productControllers.delete)
    .patch(productControllers.update)

module.exports = router;