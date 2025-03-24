const { model, Schema, default: mongoose } = require('mongoose');


const schema = new Schema({
     name: {
        type: String,
        required: true
     } ,
     bgColor:{
        "type": String,
        "required": true,
        default: "#b73e3e"
     },
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Each menu must belong to a user
      },
        icon:{
            "type": String,
            "required": true,
            default: "🍲"
        },
        items: [
            {
                // id: {
                //     type: Number,
                //     required: true
                // },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                category: {
                    type: String,
                    required: true,
                    default: "Vegetarian"
            }
        }
        ]
});

// Create the Order model from the schema
const Menu = model('Menu', schema);

// Export the Order  model for use in other parts of the application
module.exports = Menu;