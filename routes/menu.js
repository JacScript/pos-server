const createHttpError = require("http-errors");
const { isVerifiedUser } = require("../middlewares/verifyToken");
const Menu = require('../models/menuModel');

const router = require("express").Router();


// @desc    Add Order
//route     /order
//@access   Public
router.post("/",isVerifiedUser, async(request, response,next) => {
    try{

      // console.log("Incoming Order Data:", request.body);
       const menu = await new Menu(request.body);
       await menu.save();

       response.status(200).json({success: true, message: "Menu created successfuly", data: menu})

    } catch(err){
      console.log(err)
        const error = createHttpError(500, "Fail to create order")
        return next(error)
    }
});


module.exports = router;