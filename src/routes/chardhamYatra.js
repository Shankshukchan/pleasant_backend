const express = require('express');
const router = express.Router();
const {
  getChardhamYatras,
  getChardhamYatra,
  createChardhamYatra,
  updateChardhamYatra,
  deleteChardhamYatra,
  getAdminChardhamYatras,
} = require('../controllers/chardhamYatra');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getChardhamYatras)
  .post(protect, authorize('admin'), createChardhamYatra);

router.route('/admin')
  .get(protect, authorize('admin'), getAdminChardhamYatras);

router.route('/:slug')
  .get(getChardhamYatra);

router.route('/admin/:id')
  .put(protect, authorize('admin'), updateChardhamYatra)
  .delete(protect, authorize('admin'), deleteChardhamYatra);

module.exports = router;