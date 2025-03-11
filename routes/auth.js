const router = require("express").Router();
const  User  = require('../models/userModel');
const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const matchPassword = require("../models/userModel");

// REGISTER
router.post("/register", async (request, response,next) => {
  const { username, password, img, phoneNumber,status, role  } = request.body;

  try {

     if( !username || !password || !phoneNumber || !status || !role){
        const error = createHttpError(400, 'All fields are required');
       return  next (error);
     }
    // Check if the user already exists with the provided email
    const userExists = await User.findOne({ phoneNumber });

    if (userExists) {
        const error = createHttpError(400, 'User already exists');
        return next (error);
    //   return response.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    // const hashpassword = await bcrypt.hash(password, 10);

    // Create the new user with the hashed password
      const user = await User.create({
          username,
          img,
          phoneNumber,
          password,
          status,
          role
      });

    //   //save use
    //     await user.save();

    // Generate and send the access token
    const accessToken = await jwt.sign(
      {
        id: user._id,
        isAdmin: user.role,
      },
      process.env.JWT_SEC,
      { expiresIn: "30d" }
    );

    response.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: true, // set to true if your site is served over https
      sameSite: 'none', // set to 'none' if your site is served over https
    })

    // Remove the password field from the response
    const { password: _, ...others } = user.toObject();

    // Send the created user without the password field
    // response.status(201).json({...others, accessToken});
    response.status(201).json({success:true, message: "User Created",data: {...others}, accessToken});
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server error. Please try again." });
  }
});


// @desc    Auth user/set token
//route     /auth/login
//@access   Public
router.post("/login", async (request, response, next) => {
    const { phoneNumber, password } = request.body;
  
    try {

      if(!phoneNumber || !password){
        const error = createHttpError(400, 'All fields are required');
        return next (error);
      }
      // Find user by email
      const user = await User.findOne({ phoneNumber });
  
      // Check if user exists and password matches
      if (user && (await user.matchPassword(password))) {
        // Remove the password field from the response
        const { password: _, ...others } = user.toObject();

        const accessToken = await jwt.sign(
          {
            id: user._id,
            isAdmin: user.role,
          },
          process.env.JWT_SEC,
          { expiresIn: "30d" } 
        );

        //set cookies
        response.cookie('accessToken', accessToken, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          httpOnly: true,
          secure: true, // set to true if your site is served over https
          sameSite: 'none', // set to 'none' if your site is served over https
        })
  
        // Respond with user details (excluding password)
        response.status(200).json({success: true , message: "Successfully logged in", data:{...others}, accessToken});
      } else {
        // Invalid email or password
        response.status(401).json({ message: "Invalid phone number or password" });
      }
    } catch (err) {
      console.error(err);
      response.status(500).json({ message: "Server error. Please try again." });
    }
  });

module.exports = router;