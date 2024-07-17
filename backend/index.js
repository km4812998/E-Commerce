const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://mintudb:%23Mintu%402340@cluster0.ongdxri.mongodb.net/e-commerce")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.get("/", (req, res) => {
    res.send("Hello from server");
});

// multer creation (Image Storage Engine)
const storage = multer.diskStorage({
    destination: './upload/images',  // Fixed the path
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// creating upload endpoint for image
app.use('/images', express.static('upload/images'));  // Fixed the static path

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

//Schema for creating products

const Product =mongoose.model("product",{
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    new_price:{
        type: Number,
        required: true
    },
    old_price:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true
    }
});
app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product =new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({success:true,name:req.body.name,})
})

//creating API for deleting Products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name:req.body.name
    })
})

//creating API for getting all products

app.get('/allproducts',async(req,res)=>{
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//Schema creation for user model

const Users = mongoose.model("Users", {
    name: {
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
});

//Creating Endpoint for Users

app.post('/signup', async (req, res) => {
   let check=await Users.findOne({email:req.body.email});
   if(check){
    return res.status(400).json({success:false,errors:"existing user found with same email address"})
   }
   let cart= {};
   for(let i=0;i<300;i++){
        cart[i]=0;
   }
   const user=new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
   })
   await user.save();
   const data={
    user:{
        id:user.id
    }
   }
   const token=jwt.sign(data,'secret_ecom');
   res.json({success:true,token});
});

//creating endpoint for user login

app.post('/login', async (req, res) => {
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
    
    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token});
});

//creating endpoints for newcollections data

app.get('/newcollections', async (req, res) => {
    let products=await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
});

//popular in women collection

app.get('/popularinwomen', async (req, res) => {
    let products=await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular Women Collection Fetched");
    res.send(popular_in_women);
});


//creating middleware to fetch user

const fetchUser = async (req, res,next) => {
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please Authenticate with valid tokan"})
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }
        catch(err){
            res.status(401).send({errors:"please authenticate using valid token"})
        }
    }
}

//creating endpoint for adding products to the cartdata

app.post('/addtocart',fetchUser,async (req, res) => {
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
});

//creating endpoint to remove cart data

app.post('/removefromcart',fetchUser,async (req, res) => {
    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
        userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
});

//creating endpoint to get cart data

app.get('/getcart',fetchUser,async (req, res) => {
    console.log("Get Cart");
    let userData=await Users.findOne({_id:req.user.id}); 
    res.json(userData.cartData)
});

// creating user registration endpoint
app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
