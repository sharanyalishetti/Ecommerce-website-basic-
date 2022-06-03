const exp  = require('express')
const userApp = exp.Router()
userApp.use(exp.json())

//import bcrypt for password hashing
const bcryptjs = require("bcryptjs")

//import jsonwebtoken to create token
const jwt = require("jsonwebtoken")

require("dotenv").config()
const verifyToken=require('./middlewares/verifyToken')

var cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer")

//configure cloudinary
cloudinary.config({
    cloud_name :process.env.CLOUD_NAME, 
    api_key : process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    secure : true
});

//configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : async(req,file) => {
        return {
            folder :"vnr2022",
            public_id : file.fieldname + "-" + Date.now(),

        };
    },
});

//configure multer
var upload = multer({storage : cloudinaryStorage});

const expressAsyncHandler = require("express-async-handler")
const { response } = require('express')

/*const users = [
    {
        id : 1,
        name : "ravi",
        age : 21
    },
    {
        id : 2,
        name : "Kiran",
        age : 23
    }
]*/

/*userApp.use((request,response,next) => {
    console.log("Middleware 1")
    next();

})*/

userApp.get('/getusers',verifyToken,expressAsyncHandler(async(request,response) => {
    //get user collection objet
    let userCollectionObject = request.app.get("userCollectionObject");
    let users = await userCollectionObject.find().toArray();
    response.send({message: "All users", payload:users});
}))

userApp.get('/getuser/:id',(request,response) => {

    let userId = (+request.params.id)
    let userObj = users.find(userObj => userId == userObj.id)

    if(userObj === undefined)
    {
        response.send({message: "User not Existed"})
    }
    else{
        response.send({message : "User Found", payload : userObj})
    }
    
})

userApp.post('/login',expressAsyncHandler(async(request,response) => {
    //get user collection objet
    let userCollectionObject = request.app.get("userCollectionObject");
    //get user credentials frm body
    let userCredObj = request.body;
    //search for user by username
    let userOfDB = await userCollectionObject.findOne({username : userCredObj.username});
    //if user not existed
    if(userOfDB == null) {
        response.send({message : "Invalid user"});
    }
    //if username existed
    else {
        //compare passwords
        let status = await bcryptjs.compare(userCredObj.password, userOfDB.password);
        //if password not matched
        if(status == false) {
            response.send({message : "Invalid password"})
        }
        else {
            //create token
            let token = jwt.sign({username : userOfDB.username},process.env.SECRET_KEY,{expiresIn : 60});
            //send token
            response.send({message:"login sucess",payload : token, userObj : userOfDB})
        }
    }
}))

userApp.post('/create-user',upload.single("photo"),expressAsyncHandler(async(request,response) => {
    //let newUser = request.body;
    //console.log(newUser)
    //users.push(newUser)

    //console.log(request.file.path);
    //get user collection objet
    let userCollectionObject = request.app.get("userCollectionObject");

    //get user object from client and convert into user Object
    let newUserObj = JSON.parse(request.body.userObj);

    //search for user by name
    let userOfDB = await userCollectionObject.findOne({username : newUserObj.username});

    //if user existed
    if(userOfDB != null){
        response.send({message : "username has already taken"})
    }
    else {
        //hash password
        let hashedpassword = await bcryptjs.hash(newUserObj.password, 6);
        //replace the hashword password with plain password
        newUserObj.password = hashedpassword;
        //add profile image link to newuserObj
        newUserObj.profileImg = request.file.path;
        //delete photo propery
        delete newUserObj.photo;
        //insert new user
        await userCollectionObject.insertOne(newUserObj);

        response.send({message : "New user created"})
    }

}))


//private Route to create-user
userApp.get('/test',verifyToken, (request,response) => {
    response.send({message : "This reply is from private route"})
})

//ROuter t =o update user
userApp.put('/update-user/:id',(request,response) => {
    let userId = (+request.params.id);
    let userObj = users.find(userObj => userId == userObj.id)
    let newUser = request.body;
    if(userObj == undefined)
    {
        response.send({message : "User not found"})
    }
    else
    {
        userId = userId -1
        users.splice(userId,1,newUser);
        //console.log(Newusers)
        //users.insert(userId,userObj)
        response.send({message : " User updated", payload : users})
    }
    
})

userApp.delete('/delete-user/:id',(request,response) => {
    let userId = (+request.params.id)
    let userObj = users.find(userObj => userId == userObj.id)
    if(userObj == undefined)
    {
        response.send({message : "User not found"})
    }
    else{
        userId = userId -1
        users.splice(userId,1)
        response.send({message : "User Specified deleted", payload : users})
    }

    
})



module.exports = userApp;