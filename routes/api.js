const express = require('express')
var router = express.Router();
const booksController = require('../controller/booksController')

router.get('/', function (req, res) {
    res.json({
        'API': '1.0'
    });
});

router.get('/books', booksController.getBooks);
router.post('/books', booksController.saveBooks);
router.post('/user', booksController.addUsers);
router.get('/user/:userId', booksController.getUser);
router.post('/user/login', booksController.signInUser);
router.post('/purchase', booksController.buyBooks);

module.exports = router;