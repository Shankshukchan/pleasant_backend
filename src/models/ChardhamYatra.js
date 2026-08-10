const mongoose = require('mongoose');

const ChardhamYatraSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a yatra title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  shortDescription: String,
  image: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  images: [String],
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String,
    image: String,
  }],
  highlights: [String],
  highlightsImages: [String],
  destinations: [{
    name: String,
    description: String,
    image: String,
    significance: String,
  }],
  whatIncludes: [String],
  whatExcludes: [String],
  faqs: [{
    question: String,
    answer: String,
  }],
  price: {
    actual: { type: Number, required: true },
    discounted: { type: Number },
    currency: { type: String, default: 'INR' },
    perPerson: { type: Boolean, default: true },
  },
  maxGroupSize: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'moderate',
  },
  bestTimeToVisit: String,
  howToReach: {
    byAir: String,
    byTrain: String,
    byRoad: String,
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metaTitle: String,
  metaDescription: String,
  bookingCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

ChardhamYatraSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.metaTitle) {
    this.metaTitle = `${this.title} | Pleasant Yatra`;
  }
  if (!this.metaDescription) {
    this.metaDescription = `Book ${this.title} at best price. ${this.duration.days} Days / ${this.duration.nights} Nights Char Dham Yatra starting from ₹${this.price.discounted || this.price.actual}. Pleasant Yatra.`;
  }
  next();
});

ChardhamYatraSchema.index({ slug: 1 });
ChardhamYatraSchema.index({ isActive: 1 });
ChardhamYatraSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('ChardhamYatra', ChardhamYatraSchema);