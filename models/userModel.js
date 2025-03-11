const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
    username: {
        type: String,
        // required: true
    },

    phoneNumber: {
        unquie: true,
        type: String,
        // match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'] // Validates phone number format
        required: true,
        validator: {
            validate: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },

    role: {
        type: String,
        required: true,
        // enum: ['admin', 'user'],
        // default: 'user'
    },

    img: {
        type: String // Optional profile image URL
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'], // Allowed status values
        default: 'active' // Default status
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true });

// Method to match entered password with the hashed password in database
schema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypts password before saving if it has been modified
schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10); // Generates a salt for hashing
    this.password = await bcrypt.hash(this.password, salt); // Hashes password
});


// Optional: Indexes for performance optimization on createdAt and updatedAt fields
schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

// Create the User model from the schema
const User = model('User', schema);

// Export the User model for use in other parts of the application
module.exports = User;

