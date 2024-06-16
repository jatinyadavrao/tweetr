const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    likes:[{
        type:String,
        default:[],
    }]
    ,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment',
            default:[]
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);
module.exports = Post