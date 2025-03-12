const { model, Schema } = require("mongoose");

const schema =  new Schema ( {

});


// Create the Order model from the schema
const Order = model('Order', schema);

// Export the Order  model for use in other parts of the application
module.exports = Order