// function adminOnly = async (req, res, next) => {
//   try {
//     // Get the authorization header from the request
//     //const {userType} = req.body;
//     if (req.body.userType != "Tutor" || "Admin") {
//       // If no authorization header is provided, return an error response
//       return res
//         .status(401)
//         .json({ message: "Authorization header not provided" });
//     }

//     // Extract the JWT token from the authorization header
//     // const token = authHeader.split(" ")[1];
//     // if (!token) {
//     //   // If no token is provided, return an error response
//     //   return res
//     //     .status(401)
//     //     .json({ message: "Authentication token not provided" });
//     // }

//     // Verify the JWT token and decode its payload
//     // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     // const { userId } = decodedToken;

//     // // Check if the authenticated user is an admin
//     // const user = await User.findById(userId);
//     // if (!user || user.role !== "admin") {
//     //   // If the authenticated user is not an admin, return an error response
//     //   return res.status(401).json({ message: "Unauthorized access" });
//     // }

//     // If the authenticated user is an admin, call the next middleware function
//     next();
//   } catch (error) {
//     // If an error occurs during authentication, return an error response
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Export the middleware function for use in other parts of the application
// module.exports = adminOnly;
