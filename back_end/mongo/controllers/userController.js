const {mongoCredentials} = require('../models/utils.js')
const userModel = require('../models/userMethods');
const postModel = require("../models/postMethods");
const {createError} = require("../models/utils");
const {createMaxQuotaJob} = require("./CronController");


const addUser = async (req, res, next) => {
    try {
        req.response = await userModel.addUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}
const searchUser = async (req,res) => {
    res.send(await userModel.searchByUsername(req.body,mongoCredentials));
}

const changePassword = async (req,res) => {
    res.send(await userModel.changePwsd(req.body,mongoCredentials));
}

const getSessionUser = async (req,res) => {
    res.send({username: req.session.user});
}

const getUserProfileByName = async (req,res) => {
    console.log(req.query)
    res.send(await userModel.getUserProfilePicture(req.query.name, mongoCredentials));
}

const updateUserProfilePic = async (req, res) => {
    try {
        res.send(await userModel.updateProfilePicture(req.session.user, req.body.newProfilePic, mongoCredentials));
    } catch (err) {
        res.status(400).send("errore nel cambiamento dell'immagine");
    }
}

const updateSessionVip = async (req,res) => {
    try{
        req.session.vip = req.body.vipName;
        req.session.save();
        res.send({vip: req.session.vip})
    }catch (e) {
        console.log(e)
    }
}
const getSessionVip = async (req,res) => {
    res.send({vip: req.session.vip})
}

const modifyUser = async(req,res) => {
    try{
        res.send(await userModel.altUser(req.body,mongoCredentials));
    }
    catch(error) {
        res.send(error);
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.send(await userModel.getUsers(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await userModel.usersLength(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getVips = async (req,res) => {
    try {
        res.send(await userModel.getHandledVip(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getQuota = async (req,res) => {
    try {
        let username = req.query.user;
        res.send(await userModel.getUserQuota(username));
    }
    catch (error) {
        res.send(error);
    }
}

const updateMaxQuota = async(req,res) => {

    try{
        let percentage= req.body.percentage;

        if (isNaN(percentage)) throw createError('percentage not number', 404);  //cambiare

        let res = await userModel.updateMaxQuota(percentage,req.body.user)

        //caso di errore -> preso dal catch;
        let tsyear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime();

        /*
        TODO: PER POPI, in caso di altri utilizzi, bisogna creare funzione che calcola il timestamp desiderato
         */
        createMaxQuotaJob(tsyear,percentage,req.body.user);

        res.send(await userModel.updateMaxQuota(percentage,user));

    }
    catch(err){
        res.send(err)
    }
}

const getFollnPosts = async(req,res)=> {
    try {
        res.send(await userModel.get_n_FollnPosts(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getLastPost = async(req,res)=> {
    try {
        let response = await postModel.getLastPostUser(req.query, mongoCredentials)
        res.send({post: response});
    } catch (error) {
        res.send(error);
    }
}

module.exports = {
    addUser,
    searchUser,
    changePassword,
    getSessionUser,
    updateSessionVip,
    getSessionVip,
    modifyUser,
    getAllUsers,
    getUsersNumber,
    getVips,
    getQuota,
    getFollnPosts,
    getLastPost,
    updateMaxQuota,
    getUserProfileByName,
    updateUserProfilePic
}