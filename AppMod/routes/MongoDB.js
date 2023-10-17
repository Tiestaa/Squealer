const express = require('express');
const {createUser,search,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser} = require('../controllers/MongoController');
const {createSession} = require("../../Frontpage/controllers/FrontPageController");
const {dashboard} = require("../controllers/ModController");
const router = express.Router();

router.post('/user',createUser,(req,res) => {
    res.redirect('/mod');
});
router.put('/user',modifyUser);
router.post('/addPost',createPost);
router.get('/userid',getSessionUser);
router.get('/nusers',getUsersNumber);
router.get('/users',getAllUsers);
//router.get('/user',getUser);

module.exports = router;