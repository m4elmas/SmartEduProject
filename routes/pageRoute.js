const express = require('express')
const pageController = require('../controllers/pageController');
const redirectmiddleware = require('../middlewares/redirect');
const router = express.Router();

router.route('/').get(pageController.getHome)
router.route('/about').get(pageController.getAbout)
router.route('/register').get(redirectmiddleware,pageController.getRegisterPage)
router.route('/login').get(redirectmiddleware,pageController.getLoginPage)
router.route('/contact').get(pageController.getContactPage)
router.route('/contact').post(pageController.sendEmail)
module.exports = router;