const mongoose = require('mongoose');

const PackageCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#0A2E57'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  packageCount: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String
}, {
  timestamps: true
});

PackageCategorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.metaTitle) {
    this.metaTitle = `${this.name} Packages | Pleasant Yatra`;
  }
  if (!this.metaDescription) {
    this.metaDescription = `Explore our curated ${this.name} tour packages. Find the best deals on ${this.name.toLowerCase()} travel packages at Pleasant Yatra.`;
  }
  next();
});

PackageCategorySchema.index({ slug: 1 });
PackageCategorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('PackageCategory', PackageCategorySchema);
