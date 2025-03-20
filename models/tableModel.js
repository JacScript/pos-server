const { model, Schema,  default:mongoose } = require("mongoose");

const schema = new Schema ({
    tableNo: {
        type:  Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: "Available"
    },
    seats: {
        type: Number,
        required: true
    },

    currentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }

}, {timestamps:true})


// Create the Order model from the schema
const Table = model('Table' , schema);

// Export the Table  model for use in other parts of the application
module.exports = Table;