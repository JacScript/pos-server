const { isVerifiedUser } = require("../middlewares/verifyToken");

const router = require("express").Router();



// @desc    Add Order
//route     /order
//@access   Public
router.post("/",isVerifiedUser, async(request, response,next) => {
    try{

    } catch(err){

    }
});

// @desc    Get Order
//route     /order/find/:id
//@access   Public
router.get("/:id", isVerifiedUser, async(request, response, next) => {
  try {
    
  } catch (error) {
    
  }
});


// @desc    Get Order
//route     /orders
//@access   Public
router.get("/",isVerifiedUser, async(request, response, next) => {
  try {
    
  } catch (error) {
    
  }
});

// @desc    Edit Order
//route     /order
//@access   Public
router.put("/:id",isVerifiedUser, async(request, response, next) => {
    try {
        
    } catch (error) {
        
    }
});


module.exports = router; 
