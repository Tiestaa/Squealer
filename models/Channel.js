const mongoose= require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    nfollowers: {
        type: Number,
        required: true,
    },
    followers: [
        {
            type: mongoose.Schema.ObjectId,     //utenti
            required: true,
        }
    ],
    posts: [
        {
            type: mongoose.Schema.ObjectId,     //post
            required: true,
        }
    ],
    administrators: [
        {
            type: mongoose.Schema.ObjectId,     //utenti
            required: true,
        }
    ]
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;