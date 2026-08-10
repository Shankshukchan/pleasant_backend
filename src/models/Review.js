const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  stay: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stay'
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please add a review title']
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  travelDate: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  response: {
    text: String,
    date: Date
  }
}, {
  timestamps: true
});

ReviewSchema.index({ package: 1, isApproved: 1 });
ReviewSchema.index({ destination: 1, isApproved: 1 });
ReviewSchema.index({ stay: 1, isApproved: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
