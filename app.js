const express = require("express");//import express
const app = express();//initialize to app
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const JWT_SECRET =
    "akondfasfdoiwned()asdasndjnanwd{}adc[]]Adsnwnii1232nlka213213kanskdcniwai213124r2314e";


const mongoURL = "mongodb+srv://pvnhari2156:Praveenhari2000@cluster0.o6eatlm.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(mongoURL, {
        useNewURLParser: true
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch(e => console.log(e));



require("./userDetails");

const User = mongoose.model("UserInfo");


//login API for Register User page
app.post("/register", async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;
    //const { fname, lname, email, phoneNumber, password, userType } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send({ error: "User Exists" });
        }
        await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
            userType,                
        });
        User.save();
        res.send({ status: "ok" });

    } catch (error) {
        res.send({ status: "error" });
    }

});


//login API for login page

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;//request email, password

    const user = await User.findOne({ email });//check exist or not
    if (!user) {
        return res.json({ error: "User not exists" });
    }
    if (await bcrypt.compare(password, user.password)) {//compare password
        const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "30s",
        });//create token with random digit above

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Password " });
});



//get data of user

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        });
        console.log(user);
        if (user == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const useremail = user.email;
        User.findOne({ email: useremail })
            .then((data) => {
                res.send({ status: "ok", data: data });
            })
            .catch((error) => {
                res.send({ status: "error", data: error });
            });
    } catch (error) { }

});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Existed" })
        }
        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "pvnhari2156@gmail.com",
                pass: "sbhnhsmavulqqgda",
            }
        });

        var mailOptions = {
            from: "youremail@gmail.com",
            to: "linux2156@gmail.com",
            subject: 'Password Reset',
            text:link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        console.log(link);
    } catch (error) {
        console.log(error);
    }
});

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Existed" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email ,status: "Not Verified" });
    } catch (error) {
        // console.log(error);
        res.send("Not Verified");
    }
   
});


app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Existed" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );

        res.json({ status: "Password Updated" });
        
        res.render("index", { email: verify.email, status: "Verified" });
        // res.render('/login-user')
    } catch (error) {
        console.log(error);
        // res.json({ status: "Something Went Wrong" });
    }
});

app.get("/getAllUsers",  async(req,res) => {
    try {
        const allUser = await User.find({});
        res.send({status: "ok" , data:allUser})

    } catch (error) {
        console.log(error)
    }
})

app.listen(5000, () => {
    console.log("Server Started");
});



