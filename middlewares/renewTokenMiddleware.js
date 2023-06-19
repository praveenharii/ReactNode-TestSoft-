
require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


const renewTokenMiddleware = async (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

 if (!token) {
   return res.status(401).json({ message: "Unauthorized" });
 }

 try {
   const decoded = jwt.verify(token, JWT_SECRET);

   const newToken = jwt.sign(
     { email: decoded.email, userType: decoded.userType, userId: decoded._id },
     JWT_SECRET,
     {
       //expiresIn: "1h",
     }
   );

   //res.setHeader("Authorization", "Bearer " + newToken);
   //res.status(200).json({ status: "ok", token: newToken });

   req.newToken = newToken;
   next();
 } catch (err) {
   console.error(err);
   res.status(500).send("An error occurred while renewing the token.");
 }
};

module.exports = renewTokenMiddleware;
