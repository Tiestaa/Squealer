const officialChannel = require('../models/officialChannelsMethods');

/* Reserved Channel Methods */
const createReservedChannel = async (req,res,next) => {
    try {
        req.response = await officialChannel.addOfficialChannel(req.body,{name: req.session.user});
        next();
    }
    catch(error) {
        res.send(error);
    }
}
const deleteCh = async (req,res) => {
    try {
        res.send(await officialChannel.deleteChannel(req.body));
    }
    catch(error) {
        res.send(error);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.send(await officialChannel.channelsLength(req.query));
    }
    catch (error) {
        res.send(error);
    }
}

const getChannel = async (req,res) => {
    try {
        res.send(await officialChannel.getChannels(req.query));
    }
    catch (error) {
        res.send(error);
    }
}

const modifyDesc = async (req,res) => {
    try {
        res.send(await officialChannel.modifyDescription(req.body))
    }
    catch(error) {
        res.send(error);
    }
}

const channel = async (req,res) => {
    try {
        res.send(await officialChannel.searchByChannelName(req.query))
    }
    catch(error) {
        res.send(error);
    }
}


module.exports = {
    createReservedChannel,
    deleteCh,
    getChannelsNumber,
    getChannel,
    modifyDesc,
    channel
}