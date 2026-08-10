const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a state name'],
    trim: true,
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  image: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'central', 'northeast', 'international'],
    default: 'north'
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

StateSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('State', StateSchema);
