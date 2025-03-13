const { isVerifiedUser } = require('../middlewares/verifyToken');

const router = require('express').Router();


// @desc    Add Order
//route     /table
//@access   Private
router.post("/", isVerifiedUser,(request, response, next) => {
    try {
        
    } catch (error) {
        return next(error)
    }
});

// @desc    Get Tables
//route     /order
//@access   Private
router.get("/", isVerifiedUser, (request, response, next) => {
    try {
        
    } catch (error) {
      return next(error);        
    }
});

//// @desc    Update Order
//route     /order
//@access   Private
router.put("/:id", isVerifiedUser, (request, response, next) => {
    try {
        
    } catch (error) {
        return next(error);
    }
});

module.exports = router;