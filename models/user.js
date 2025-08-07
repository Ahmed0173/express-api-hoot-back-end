const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  hashedPassword: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Remove password from JSON output
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
    return returnedObject;
  }
});

module.exports = mongoose.model('User', userSchema);
