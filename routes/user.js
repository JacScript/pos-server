const User = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const { mongoose } = require("mongoose");



    // @desc    get users 
//route     GET /user/find/:id
//@access   private
router.get('/', verifyTokenAndAdmin, async (request, response) => {
    const query = request.query.new;
    const { userId } = request.query; // Capture userId from query params
  
    try {  
        // Find users and exclude the password field
        const users = query
            ? await User.find().select('-password').sort({ _id: -1 }).limit(5)
            : await User.find().select('-password');
  
        // If a userId is provided, calculate the total order amount for that user
        if (userId) {
            const orders = await Order.find({ userId });
            const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
            return response.status(200).json({
                userId,
                totalOrderAmount: totalAmount,
                orders
            });
        } 
  
        // Send success response with user list if no userId is provided
        response.status(200).json(users);
    } catch (err) {
        console.error(err);
        // Handle server error
        response.status(500).json({ message: "Server error. Please try again." });
    }
  });