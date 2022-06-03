const exp = require('express')
const app = exp()
const mClient = require("mongodb").MongoClient;

require('dotenv').config()

const path = require('path')

//connect build at react app with nodejs
app.use(exp.static(path.join(__dirname,'./build')))
//DB connection URL
const DBurl = process.env.DATABASE_CONNECTION_URL;

//connect with mongoDB server
mClient.connect(DBurl)
.then((client) => {

    //get DB Object
    let dbObj = client.db("vnr2022db");

    //create collection objects
    let userCollectionObject = dbObj.collection("usercollection")
    let productCollectionObject = dbObj.collection("productcollection")

    //sharing collections objects to apis
    app.set("userCollectionObject",userCollectionObject)
    app.set("productCollectionObject",productCollectionObject)


    console.log("DB Connection Success")
})
.catch(err=> console.log("Error in DB connection",err))
//importing specific apis
const userApp = require('./APIS/userApi')
const productApp = require('./APIS/productApi')

//executing specific api middleware based on the path
app.use('/user-api',userApp)
app.use('/product-api',productApp)

//to deal with page refreshing
app.use("*",(request,response) => {
    response.sendFile(path.join(__dirname,'./build/index.html'))
})

//middleware to handle invalid paths
app.use((request,response,next) => {
    response.send({message : `path ${request.url} is invalid`})
})

//middleware to handle errors
app.use((error,request,response,next) => {
    response.send({message : "Message occured", reason : `${error.message}`})
})

const port = process.env.PORT;
app.listen(port,()=> {console.log(`web server listening on ${port}...`)})