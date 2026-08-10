const mongoose = require('mongoose');

const StaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  city: String,
  state: String,
  type: {
    type: String,
    enum: ['hotel', 'resort', 'homestay', 'guesthouse', 'villa', 'hostel'],
    default: 'hotel'
  },
  image: {
    type: String,
    default: ''
  },
  images: [String],
  price: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    perNight: { type: Boolean, default: true }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  amenities: [String],
  address: String,
  description: String,
  shortDescription: String,
  highlights: [String],
  highlightsImages: [String],
  whatIncludes: [String],
  whatExcludes: [String],
  bestTimeToVisit: String,
  howToReach: {
    byAir: String,
    byTrain: String,
    byRoad: String,
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String
}, {
  timestamps: true
});

StaySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = (this.name + '-' + (this.city || this.state || ''))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Stay', StaySchema);
