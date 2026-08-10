const { body, param, query } = require('express-validator');

const REGIONS = ['north', 'south', 'east', 'west', 'central', 'northeast', 'international'];
const STAY_TYPES = ['hotel', 'resort', 'homestay', 'guesthouse', 'villa', 'hostel'];
const DIFFICULTY = ['easy', 'moderate', 'challenging'];
const BLOG_CATEGORIES = [
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
  'culture',
];
const INQUIRY_TYPES = ['package', 'flight', 'hotel', 'bus', 'cab', 'service'];
const INQUIRY_STATUS = ['new', 'contacted', 'converted', 'closed'];
const CONTACT_STATUS = ['new', 'replied', 'closed'];

const PHONE_REGEX = /^[+]?[\d][\d\s\-()]{7,17}$/;

const LABELS = {
  destination: 'Destination',
  package: 'Package',
  service: 'Service',
  stay: 'Stay',
  author: 'Author',
};

const objectId = (field, { optional = true } = {}) => {
  const label = LABELS[field] || field;
  const chain = body(field);
  return (optional ? chain.optional({ nullable: true, checkFalsy: true }) : chain)
    .isMongoId()
    .withMessage(`Please select a valid ${label.toLowerCase()}`);
};

const idParam = param('id').isMongoId().withMessage('Invalid id');

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit must be between 1 and 1000').toInt(),
];

/* ---------------------------------- Auth ---------------------------------- */

const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

/* --------------------------------- States --------------------------------- */

const stateCreateRules = [
  body('name').trim().notEmpty().withMessage('State name is required').isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('region').optional().isIn(REGIONS).withMessage('Invalid region'),
  body('description').optional({ checkFalsy: true }).isLength({ max: 2000 }).withMessage('Description is too long'),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Order must be 0 or more'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true/false'),
];

const stateUpdateRules = [
  idParam,
  body('name').optional().trim().notEmpty().withMessage('State name cannot be empty').isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('region').optional().isIn(REGIONS).withMessage('Invalid region'),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Order must be 0 or more'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true/false'),
];

/* ------------------------------ Destinations ------------------------------ */

const destinationCreateRules = [
  body('name').trim().notEmpty().withMessage('Destination name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('region').trim().notEmpty().withMessage('Region is required').bail().isIn(REGIONS).withMessage('Invalid region'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('image').trim().notEmpty().withMessage('Cover image is required'),
  body('shortDescription').optional({ checkFalsy: true }).isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('highlights').optional().isArray().withMessage('Highlights must be a list'),
  body('images').optional().isArray().withMessage('Images must be a list'),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

const destinationUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Destination name cannot be empty').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('region').optional().isIn(REGIONS).withMessage('Invalid region'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('image').optional().trim().notEmpty().withMessage('Cover image cannot be empty'),
  body('shortDescription').optional({ checkFalsy: true }).isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('highlights').optional().isArray().withMessage('Highlights must be a list'),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

/* -------------------------------- Packages -------------------------------- */

const packageCreateRules = [
  body('title').trim().notEmpty().withMessage('Package title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  objectId('destination', { optional: false }),
  body('description').trim().notEmpty().withMessage('Overview is required'),
  body('image').trim().notEmpty().withMessage('Cover image is required'),
  body('duration').custom((v) => v && typeof v === 'object').withMessage('Duration is required'),
  body('duration.days').isInt({ min: 1 }).withMessage('Duration days must be at least 1'),
  body('duration.nights').isInt({ min: 0 }).withMessage('Duration nights must be 0 or more'),
  body('price.actual').isFloat({ min: 0 }).withMessage('Actual price is required'),
  body('price.discounted').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Discounted price must be a positive number')
    .bail()
    .custom((v, { req }) => !req.body.price?.actual || Number(v) <= Number(req.body.price.actual))
    .withMessage('Discounted price cannot be higher than actual price'),
  body('categories').optional().isArray().withMessage('Categories must be a list'),
  body('categories.*').optional().isMongoId().withMessage('Invalid category id'),
  body('maxGroupSize').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Max group size must be at least 1'),
  body('difficulty').optional({ checkFalsy: true }).isIn(DIFFICULTY).withMessage('Invalid difficulty'),
  body('itinerary').optional().isArray().withMessage('Itinerary must be a list'),
  body('faqs').optional().isArray().withMessage('FAQs must be a list'),
  body('isActive').optional().isBoolean(),
];

const packageUpdateRules = [
  idParam,
  body('title').optional().trim().notEmpty().withMessage('Package title cannot be empty').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  objectId('destination'),
  body('description').optional().trim().notEmpty().withMessage('Overview cannot be empty'),
  body('image').optional().trim().notEmpty().withMessage('Cover image cannot be empty'),
  body('duration.days').optional().isInt({ min: 1 }).withMessage('Duration days must be at least 1'),
  body('duration.nights').optional().isInt({ min: 0 }).withMessage('Duration nights must be 0 or more'),
  body('price.actual').optional().isFloat({ min: 0 }).withMessage('Actual price must be a positive number'),
  body('price.discounted').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Discounted price must be a positive number'),
  body('categories').optional().isArray().withMessage('Categories must be a list'),
  body('categories.*').optional().isMongoId().withMessage('Invalid category id'),
  body('difficulty').optional({ checkFalsy: true }).isIn(DIFFICULTY).withMessage('Invalid difficulty'),
  body('isActive').optional().isBoolean(),
];

/* ---------------------------------- Stays --------------------------------- */

const stayCreateRules = [
  body('name').trim().notEmpty().withMessage('Stay name is required'),
  body('type').optional({ checkFalsy: true }).isIn(STAY_TYPES).withMessage('Invalid property type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  objectId('destination'),
  body('price.amount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('rating.average').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('rating.count').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Review count must be 0 or more'),
  body('amenities').optional().isArray().withMessage('Amenities must be a list'),
  body('images').optional().isArray().withMessage('Images must be a list'),
  body('isActive').optional().isBoolean(),
];

const stayUpdateRules = [
  idParam,
  body('name').optional().trim().notEmpty().withMessage('Stay name cannot be empty'),
  body('type').optional({ checkFalsy: true }).isIn(STAY_TYPES).withMessage('Invalid property type'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  objectId('destination'),
  body('price.amount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('rating.average').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('isActive').optional().isBoolean(),
];

/* -------------------------------- Services -------------------------------- */

const serviceCreateRules = [
  body('title').trim().notEmpty().withMessage('Service title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('shortDescription').optional({ checkFalsy: true }).isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('price.amount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Order must be 0 or more'),
  body('highlights').optional().isArray().withMessage('Highlights must be a list'),
  body('processSteps').optional().isArray().withMessage('Process steps must be a list'),
  body('faqs').optional().isArray().withMessage('FAQs must be a list'),
  body('isActive').optional().isBoolean(),
];

const serviceUpdateRules = [
  idParam,
  body('title').optional().trim().notEmpty().withMessage('Service title cannot be empty').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional({ checkFalsy: true }).isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('price.amount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('isActive').optional().isBoolean(),
];

/* ---------------------------------- Blogs --------------------------------- */

const blogCreateRules = [
  body('title').trim().notEmpty().withMessage('Blog title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('image').trim().notEmpty().withMessage('Featured image is required'),
  body('category').trim().notEmpty().withMessage('Category is required').bail().isIn(BLOG_CATEGORIES).withMessage('Invalid blog category'),
  body('excerpt').optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be a list'),
  objectId('destination'),
  objectId('author'),
  body('publishedAt').optional({ checkFalsy: true }).isISO8601().withMessage('Published date must be a valid date'),
  body('isPublished').optional().isBoolean(),
];

const blogUpdateRules = [
  idParam,
  body('title').optional().trim().notEmpty().withMessage('Blog title cannot be empty').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('image').optional().trim().notEmpty().withMessage('Featured image cannot be empty'),
  body('category').optional().isIn(BLOG_CATEGORIES).withMessage('Invalid blog category'),
  body('excerpt').optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  objectId('destination'),
  objectId('author'),
  body('publishedAt').optional({ checkFalsy: true }).isISO8601().withMessage('Published date must be a valid date'),
  body('isPublished').optional().isBoolean(),
];

/* ------------------------------- Categories ------------------------------- */

const categoryCreateRules = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('color').optional({ checkFalsy: true }).matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).withMessage('Color must be a valid hex code, e.g. #0A2E57'),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Order must be 0 or more'),
  body('isActive').optional().isBoolean(),
];

const categoryUpdateRules = [
  idParam,
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty').isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('color').optional({ checkFalsy: true }).matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).withMessage('Color must be a valid hex code, e.g. #0A2E57'),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage('Order must be 0 or more'),
  body('isActive').optional().isBoolean(),
];

/* -------------------------------- Inquiries ------------------------------- */

const inquiryCreateRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required').bail().matches(PHONE_REGEX).withMessage('Enter a valid phone number'),
  body('serviceType').optional({ checkFalsy: true }).isIn(INQUIRY_TYPES).withMessage('Invalid enquiry type'),
  objectId('package'),
  objectId('destination'),
  objectId('service'),
  body('travelDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Travel date must be a valid date'),
  body('travelers').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage('Travellers must be between 1 and 100'),
  body('message').optional({ checkFalsy: true }).isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
];

const inquiryUpdateRules = [
  idParam,
  body('status').optional().isIn(INQUIRY_STATUS).withMessage('Invalid status'),
  body('notes').optional({ checkFalsy: true }).isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
];

/* --------------------------------- Contact -------------------------------- */

const contactCreateRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).matches(PHONE_REGEX).withMessage('Enter a valid phone number'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }).withMessage('Subject cannot exceed 150 characters'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  body('status').optional().isIn(CONTACT_STATUS).withMessage('Invalid status'),
];

/* --------------------------------- Reviews -------------------------------- */

const reviewCreateRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('rating').notEmpty().withMessage('Rating is required').bail().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5').toInt(),
  body('title').trim().notEmpty().withMessage('Review title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('comment').trim().notEmpty().withMessage('Review comment is required').isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters'),
  body('travelDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Travel date must be a valid date'),
  objectId('package'),
  objectId('destination'),
  objectId('stay'),
  body().custom((value) => value.package || value.destination || value.stay)
    .withMessage('A review must be linked to a package, stay or destination'),
];

/* --------------------------------- Uploads -------------------------------- */

const uploadRules = [
  body('images').optional().isArray({ max: 20 }).withMessage('You can upload up to 20 images at a time'),
  body('videos').optional().isArray({ max: 5 }).withMessage('You can upload up to 5 videos at a time'),
  body().custom((value) => (Array.isArray(value.images) && value.images.length) || (Array.isArray(value.videos) && value.videos.length))
    .withMessage('No files provided for upload'),
];

module.exports = {
  REGIONS,
  STAY_TYPES,
  DIFFICULTY,
  BLOG_CATEGORIES,
  idParam,
  paginationRules,
  loginRules,
  registerRules,
  stateCreateRules,
  stateUpdateRules,
  destinationCreateRules,
  destinationUpdateRules,
  packageCreateRules,
  packageUpdateRules,
  stayCreateRules,
  stayUpdateRules,
  serviceCreateRules,
  serviceUpdateRules,
  blogCreateRules,
  blogUpdateRules,
  categoryCreateRules,
  categoryUpdateRules,
  inquiryCreateRules,
  inquiryUpdateRules,
  contactCreateRules,
  reviewCreateRules,
  uploadRules,
};
