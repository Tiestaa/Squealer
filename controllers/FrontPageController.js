const {loginUser} = require("../dbScripts/userMethods");
const {mongoCredentials} = require("../dbScripts/utils");

const registerView = (req, res) => {
    res.render("register", {
    });
}


const frontpageView = (req,res) => {
        res.render("frontpage",{
    });
}

const login  = async (req,res,next) => {
    try {
        req.response = await loginUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}

const isUser = (req,res,next) => {
    if(req.session.authenticated && req.session.type === 'user') {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isMod = (req,res,next) => {
    if(req.session.authenticated && req.session.type === 'mod') {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isSMM = (req,res,next) => {
    if(req.session.authenticated && req.session.type === 'pro' ) {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isSessionActive = (req,res,next) => {

    if(!req.session.authenticated) {
        next();
    }
    else {
        switch (req.session.type) {
            case 'user':
                res.redirect('/homepage');
                break;

            case 'mod':
                res.redirect('/mod/homepage');
                break;

            case 'pro':
                res.redirect('/SMM/homepage');
        }
    }
}

const createSession = async(req,res) => {
    req.session.regenerate(function () {
        req.session.authenticated = true;
        req.session.user = req.response.username;
        req.session.type = req.response.typeUser;
        console.log(req.response);
        console.log(req.session);
        req.session.save();

        switch (req.response.typeUser) {
            case 'user':
                res.redirect('/homepage');
                break;

            case 'mod':
                res.redirect('/mod/homepage');
                break;

            case 'pro':
                res.redirect('/SMM/homepage');
        }

    });
}

module.exports = {
    frontpageView,
    registerView,
    login,
    isUser,
    isMod,
    isSMM,
    isSessionActive,
    createSession
};