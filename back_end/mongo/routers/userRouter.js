const express = require('express');

const userController = require('../controllers/userController');
const router = express.Router();

/* User Methods */
router.post('/',userController.addUser,(req,res) => {
    res.redirect('/mod/users');
});
router.put('/',userController.modifyUser);
router.get('/profilePic', userController.getUserProfileByName);
router.put('/profilePic', userController.updateUserProfilePic);
router.get('/session',userController.getSessionUser);
router.get('/number',userController.getUsersNumber);
router.get('/all',userController.getAllUsers);
router.get('/singleuser',userController.getSingleUser);
router.get('/getVips',userController.getVips)
router.get('/quota',userController.getQuota);
router.put('/maxquota', userController.updateMaxQuota);
router.put('/quota', userController.updateRemainingQuota)
router.put('/sessionVip',userController.updateSessionVip);
router.get('/sessionVip', userController.getSessionVip);
router.get('/info',userController.getFollnPosts);
router.get('/lastPost',userController.getLastPost);
//AGGIUNGERE
// - RICHIESTA PER TUTTI I PROFILI (o fixare getAllUsers)
// - RICHIESTA SE UN UTENTE ESISTE


//router.put('/session', userController.modifyUser);
router.delete('/clearDB', userController.clearDB);

module.exports = router;