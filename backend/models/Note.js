const mongoose= require('mongoose');
const {Schema} = mongoose;

const NotesSchema = new Schema({
    //user is also given to gget notes of a particular user only
    user:{
        type: mongoose.Schema.Types.ObjectId,  //providing user details also to store all notes of a particuar user and so that on;y he can access them
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },   
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
});

module.exports=mongoose.model('notes',NotesSchema);