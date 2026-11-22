const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 3000
  },
  status: {
    type: String,
    enum: ["new", "read", "replied"],
    default: "new"
  },
  ownerEmailSent: {
    type: Boolean,
    default: false
  },
  welcomeEmailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Contact", contactSchema);