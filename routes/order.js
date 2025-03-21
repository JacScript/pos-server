const createHttpError = require("http-errors");
const { isVerifiedUser } = require("../middlewares/verifyToken");
const Order = require("../models/orderModel");
const { mongoose } = require("mongoose");

const router = require("express").Router();



// @desc    Add Order
//route     /order
//@access   Public
router.post("/",isVerifiedUser, async(request, response,next) => {
    try{

      // console.log("Incoming Order Data:", request.body);
       const order = await new Order(request.body);
       await order.save();

       response.status(200).json({success: true, message: "Order created successfuly", data: order})

    } catch(err){
      // console.log(err)
        const error = createHttpError(500, "Fail to create order")
        return next(error)
    }
});

// @desc    Get Order
//route     /order/find/:id
//@access   Public
router.get("/:id", isVerifiedUser, async(request, response, next) => {
  try {

    const orderId = request.params.id;

   // Verify valid object ID format (optional, but recommended for security)
   if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = createHttpError(400, "Invalid order ID");
    return next(error);
    // return response.status(400).json({ message: "Invalid question ID" });
  }

  const order = await Order.findById(orderId);
  if(!order){
    const error = createHttpError(404, "Order Not Found!");
    return next(error);
  }

  response.status(200).json({success: true, data: order}); 
    
  } catch (error) {
    return next(error);
  }
});


// @desc    Get Order
//route     /orders
//@access   Public
router.get("/",isVerifiedUser, async(request, response, next) => {
  try {

    const orders = await Order.find().populate("table");
    response.status(200).json({success: true, data: orders})
    
  } catch (error) {
     return next(error);
  }
});

// @desc    Edit Order
//route     /order
//@access   Public
router.put("/:id",isVerifiedUser, async(request, response, next) => {
    try {

      const orderId = request.params.id

     // Verify valid object ID format (optional, but recommended for security)
   if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = createHttpError(400, "Invalid order ID");
    return next(error);
    // return response.status(400).json({ message: "Invalid question ID" });
  }

  const { orderStatus} = request.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus},
    {new: true} 
  );

  if(!order) {
    const error =  createHttpError(404, "Order Not Found!!");
    return next(error);
  }

  response.status(200).json({success: true, message: "Order Updated" ,  data: order})

        
    } catch (error) {
       return next(error); 
    }
});


module.exports = router; 
