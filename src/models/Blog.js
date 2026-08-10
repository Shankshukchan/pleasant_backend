const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add blog content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add a featured image']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    enum: [
      'travel-tips',
      'destination-guide',
      'packing-guide',
      'temple-guide',
      'hotel-guide',
      'weather',
      'food-guide',
      'budget-travel',
      'honeymoon',
      'adventure',
      'family-travel',
      'food',
      'culture'
    ],
    required: true
  },
  tags: [String],
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  metaTitle: String,
  metaDescription: String,
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

BlogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.metaTitle) {
    this.metaTitle = `${this.title} | Pleasant Yatra Blog`;
  }
  next();
});

BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', BlogSchema);
