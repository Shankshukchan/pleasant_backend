const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a destination name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  stateRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot be more than 300 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  images: [String],
  packageCount: {
    type: Number,
    default: 0
  },
  highlights: [String],
  bestTimeToVisit: String,
  howToReach: {
    byAir: String,
    byTrain: String,
    byRoad: String
  },
  overview: String,
  routeMap: String,
  hotels: [{
    name: String,
    image: String,
    rating: Number,
    price: String,
    description: String,
    type: String
  }],
  videos: [{
    title: String,
    url: String,
    thumbnail: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  cta: {
    title: String,
    description: String,
    buttonText: String,
    buttonLink: String
  },
  thingsToDo: [{
    title: String,
    description: String
  }],
  metaTitle: String,
  metaDescription: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  region: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'central', 'northeast', 'international'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

DestinationSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.metaTitle) {
    this.metaTitle = `${this.name} Tour Packages | Pleasant Yatra`;
  }
  if (!this.metaDescription) {
    this.metaDescription = `Explore ${this.name} with our curated tour packages. Book your ${this.name} trip with Pleasant Yatra for an unforgettable experience.`;
  }
  next();
});

module.exports = mongoose.model('Destination', DestinationSchema);
