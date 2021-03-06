const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const users = require('./routes/api/users')
//database
const {mongoURI} = require('./config/keys')

//initializing express
const app = express()

//middleware
app.use(express.json())


//DB cofig
async function conection(){
    try {
        const conected = await mongoose.connect(mongoURI , {useUnifiedTopology:true , useNewUrlParser:true , useCreateIndex:true})
        return conected + console.log("database conected")
        
    } catch (error) {
        console.log('error conecting to database')
    }
}
//calling function to conect to database
conection()

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

//Port for testing or deploy
const port = process.env.PORT || 5000// process.env.port is Heroku's port if you choose to deploy the app there

app.listen(port , ()=>{
    console.log(`Initialice on port ${port}`)
})