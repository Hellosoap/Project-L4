const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers');

router.route('/')
    .get(categoryControllers.getAll)
    .post(categoryControllers.create)

router.route('/:id')
    .get(categoryControllers.getOne)
    .delete(categoryControllers.delete)
    .patch(categoryControllers.update)

module.exports = router;