const mongoose = require("mongoose") 

 module.exports = ()=>{

    
    
    try {
        mongoose.connect(process.env.DB)
        console.log("connected to database")
    } catch (error) {
        console.log(error)
        console.log("couldn't connect to database!")
        
    }
 }