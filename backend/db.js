const mongoose= require('mongoose');
const mongoURI="mongodb://localhost:27017/notebook"  //change connection string to deploy at some other place

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo succesfully");
    })
}

module.exports=connectToMongo;