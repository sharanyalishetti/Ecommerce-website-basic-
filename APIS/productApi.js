const exp  = require('express')
const productApp = exp.Router()

productApp.use(exp.json())

let expressAsyncHandler  = require("express-async-handler")

productApp.get('/getproducts',expressAsyncHandler(async(request,response) => {
    //get product Collection Object
    let productCollectionObject = request.app.get("productCollectionObject");

    //read all product objects
    let products  = await productCollectionObject.find().toArray();
    response.send({message: "All products", payload : products})
}))

productApp.get('/getproduct/:id', expressAsyncHandler(async(request,response) => {
        //get product Collection Object
        let productCollectionObject = request.app.get("productCollectionObject");
        //get product id
        let pid = (+request.params.id)
        let product = await productCollectionObject.findOne({productId : pid})
        //console.log(product)
        //if product is null
        if(product == null) {
            response.send({message : "Product not existed"})
        }
        else{
            response.send({message : "Found product", payload : product})
        }
}))

productApp.post('/create-product',expressAsyncHandler(async(request,response) => {
   // console.log(request.body)
   // response.send({message: "Products created"})
    //get productCollectionObject
    let productCollectionObject = request.app.get("productCollectionObject")
   //get product obj from req
   let productObj = request.body;
   //insert prodductObj
   let result = await productCollectionObject.insertOne(productObj)

   //send response
   response.send({message : 'product created successfully'})

}));






productApp.put('/update-product',expressAsyncHandler(async(request,response) => {
     //get productCollectionObject
     let productCollectionObject = request.app.get("productCollectionObject")

     let modifiedProduct = request.body;

     await productCollectionObject.updateOne({productId : modifiedProduct.id}, {$set : {...modifiedProduct}})
     response.send({message: " product updated"})
}))



productApp.delete('/remove-product/:id',expressAsyncHandler(async(request,response) => {
    //get productCollectionObject
    let productCollectionObject = request.app.get("productCollectionObject")

    let pid = (+request.params.id)
    //logic to remove product by its id
    let product = await productCollectionObject.findOne({productId : pid})
    await productCollectionObject.deleteOne({productCollectionObject : product});
    response.send({message: " product  removed"})
}))



module.exports = productApp;