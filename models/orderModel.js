const { model, Schema } = require("mongoose");

const schema = new Schema({
    customerDetails: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        guests: {
            type: Number,
            required: true
        },

    },
    orderStatus: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    bills: {
        total: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            required: true
        },
        totalWithTax: {
            type: Number,
            required: true
        }
    },
    items: []
}, {timestamps: true});


// Create the Order model from the schema
const Order = model('Order', schema);

// Export the Order  model for use in other parts of the application
module.exports = Order