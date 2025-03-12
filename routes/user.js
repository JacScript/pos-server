const router = require('express').Router();
const User = require('../models/userModel.js');
const { isVerifiedUser } = require('../middlewares/verifyToken');
const { mongoose } = require("mongoose");




    // @desc    get user data
//route     GET /user/
//@access   private
router.get('/', isVerifiedUser , async (request, response,next) => {

    try {
        
      const userId = request.user._id;
      const user = await User.findById(userId);

          // Remove the password field from the response
    const { password: _, ...others } = user.toObject();

      response.status(200).json({success: true, data: {...others}})

    } catch (err) {
        next(err)
    }
});

  module.exports = router;