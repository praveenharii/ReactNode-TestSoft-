const express = require("express");//import express
const app = express();//initialize to app
const mongoose=require("mongoose");
app.use(express.json());
const cors= require("cors");
app.use(cors());
const bcrypt=require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET=   
"akondfasfdoiwned()asdasndjnanwd{}adc[]]Adsnwnii1232nlka213213kanskdcniwai213124r2314e";


const mongoURL ="mongodb+srv://pvnhari2156:Praveenhari2000@cluster0.o6eatlm.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(mongoURL,{
        useNewURLParser:true
})
    .then(()=>{ 
        console.log("Connected to database");})
    .catch(e=>console.log(e));



require("./userDetails");

const User = mongoose.model("UserInfo");


//login API for Register User page
app.post("/register", async(req,res)=>{
    const { fname, lname, email, phoneNumber, password } = req.body;

    const encryptedPassword=await bcrypt.hash(password,10);
    try{
        const oldUser= await User.findOne({ email });

        if (oldUser){
         return   res.send({ error: "User Exists" });
        }
        await User.create({
            fname,
            lname,
            email,
            phoneNumber,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });

    }catch(error) {
        res.send({ status: "error" });
    }

});


//login API for login page

app.post("/login-user", async (req, res) => {
    const { email, password } =req.body;//request email

    const user =await User.findOne({ email });//check exist or not
    if (!user) {
        return res.json({ error: "User not exists" });
    }
    if(await bcrypt.compare(password,user.password)){//compare password
        const token=jwt.sign({ email:user.email },JWT_SECRET, {
            /*expiresIn: "30s",*/
        });//create token with random digit above
        
        if(res.status(201)){
            return res.json({ status: "ok" , data: token });
        }else{
            return res.json({ error: "error" });
        }
    }
    res.json({status: "error" , error : "Invalid Password " });
});

 
//get data of user

app.post("/userData", async (req, res) => {
    const { token } =req.body;
    try{
        const user=jwt.verify(token, JWT_SECRET, (err, res) => {
            if(err) {
                return "token expired";
            }
            return res;
        });
        console.log(user);
        if(user == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const useremail=user.email;
        User.findOne({ email:useremail })
         .then((data) => {
          res.send({status:"ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
         });
    } catch(error){}

});


app.listen(5000,()=>{
    console.log("Server Started");
});

