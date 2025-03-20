const createHttpError = require('http-errors');
const { isVerifiedUser } = require('../middlewares/verifyToken');
const Table = require("../models/tableModel");
const { default: mongoose } = require('mongoose');

const router = require('express').Router();


// @desc    Add Order
//route     /table
//@access   Private
router.post("/", isVerifiedUser, async(request, response, next) => {
    try {

        const { tableNo, seats } = request.body;

        if(!tableNo) {
            const error = createHttpError(400, "Please Provide Table Number!!");
            return next(error); 
        }

        const isTablePresent = await Table.findOne({tableNo});
        if(isTablePresent) {
            const error = createHttpError(404, "Table Already Exist");
            return next(error)
        }

        const newTable = new Table({tableNo, seats });
        await newTable.save();
        response.status(200).json({success: true, message: "Table Added! ", data: newTable })

        
    } catch (error) {
        return next(error)
    }
});

// @desc    Get Tables
//route     /order
//@access   Private
router.get("/", isVerifiedUser, async (request, response, next) => {
    try {
        
      const tables = await Table.find().populate({
        path: "currentOrder",
        select: "customerDetails"
      });
      response.status(200).json({success:true, data: tables  })

    } catch (error) {
      return next(error);        
    }
});

//// @desc    Update Order
//route     /order
//@access   Private
router.put("/:id", isVerifiedUser, async(request, response, next) => {
    try {

        const tableId = request.params.id;
        const { status, orderId } = request.body;

        // Verify valid object ID format (optional, but recommended for security)
           if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(tableId)) {
            const error = createHttpError(400, "Invalid order or table ID");
            return next(error);
            // return response.status(400).json({ message: "Invalid question ID" });
          }


        const table = await Table.findByIdAndUpdate(
            tableId,
            { status, currentOrder: orderId},
            { new: true}
        );

        if(!table) {
            const error = createHttpError(404 , "Table is Not Found");
            return next(error);
        }

         response.status(200).json({success: true, message: "Table Updated!" ,data: table})
        
    } catch (error) {
        return next(error);
    }
});

module.exports = router;