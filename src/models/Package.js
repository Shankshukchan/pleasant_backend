const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a package title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  state: {
    type: String,
    default: ''
  },
  duration: {
    nights: { type: Number, required: true },
    days: { type: Number, required: true }
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: String,
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  images: [String],
  price: {
    actual: { type: Number, required: true },
    discounted: { type: Number },
    currency: { type: String, default: 'INR' },
    perPerson: { type: Boolean, default: true }
  },
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  hotels: [{
    name: String,
    type: { type: String, enum: ['budget', 'standard', 'deluxe', 'luxury'], default: 'standard' },
    location: String,
    nights: Number,
    checkIn: String,
    checkOut: String,
    amenities: [String]
  }],
  meals: {
    included: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    details: [{
      day: Number,
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'all'], default: 'all' },
      description: String
    }]
  },
  transport: {
    included: { type: Boolean, default: false },
    type: { type: String, enum: ['private', 'shared', 'self-drive', 'none'], default: 'none' },
    vehicleType: String,
    description: String,
    pickupPoint: String,
    dropPoint: String
  },
  pickupDrop: {
    pickup: {
      included: { type: Boolean, default: false },
      location: String,
      time: String,
      description: String
    },
    drop: {
      included: { type: Boolean, default: false },
      location: String,
      time: String,
      description: String
    }
  },
  cancellationPolicy: {
    type: String,
    default: ''
  },
  highlights: [String],
  places: [String],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackageCategory'
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  featured: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  availableFrom: Date,
  availableTo: Date,
  maxGroupSize: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  faqs: [{
    question: String,
    answer: String
  }],
  metaTitle: String,
  metaDescription: String,
  isActive: {
    type: Boolean,
    default: true
  },
  bookingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

PackageSchema.pre('save', function (next) {
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
    this.metaDescription = `Book ${this.title} at best price. ${this.duration.days} Days / ${this.duration.nights} Nights package starting from ₹${this.price.discounted || this.price.actual}. Pleasant Yatra.`;
  }
  next();
});

PackageSchema.index({ destination: 1, isActive: 1 });
PackageSchema.index({ categories: 1 });
PackageSchema.index({ 'price.actual': 1 });
PackageSchema.index({ slug: 1 });
PackageSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Package', PackageSchema);
