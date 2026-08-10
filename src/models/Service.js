const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: { type: String, unique: true },
  icon: { type: String, default: '' },
  category: { type: String, default: '', trim: true },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot be more than 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: { type: String, default: '' },
  images: [String],
  highlights: [String],
  includes: [String],
  documentsRequired: [String],
  turnaroundTime: String,
  price: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    note: { type: String, default: 'On Request' },
    perPerson: { type: Boolean, default: false }
  },
  processSteps: [{ title: String, description: String }],
  faqs: [{ question: String, answer: String }],
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  metaTitle: String,
  metaDescription: String
}, { timestamps: true });

ServiceSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (!this.metaTitle) this.metaTitle = `${this.title} Services | Pleasant Yatra`;
  if (!this.metaDescription) {
    this.metaDescription = `Get the best ${this.title} service with Pleasant Yatra. Reliable, affordable and hassle-free travel services across India.`;
  }
  next();
});

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ isActive: 1, order: 1 });
ServiceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
