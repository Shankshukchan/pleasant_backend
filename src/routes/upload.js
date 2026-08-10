const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadRules } = require('../validators');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function getBase64Size(base64) {
  const padding = (base64.match(/=/g) || []).length;
  return Math.ceil((base64.length * 3) / 4) - padding;
}

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

const isPlaceholderCreds = () =>
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_CLOUD_NAME.startsWith('your_') ||
  process.env.CLOUDINARY_API_KEY.startsWith('your_') ||
  process.env.CLOUDINARY_API_SECRET.startsWith('your_');

function saveLocally(dataUrl) {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const match = dataUrl.match(/^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/i);
  if (!match) return null;
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, name);
  fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
  return `/uploads/${name}`;
}

async function uploadImage(img) {
  if (typeof img !== 'string') return null;

  // Non base64 values (e.g. pasted URLs) are stored as-is
  if (!img.startsWith('data:image')) return img;

  // Validate file size for base64 images
  const size = getBase64Size(img);
  if (size > MAX_IMAGE_SIZE) {
    throw new Error(`Image size exceeds 5MB limit`);
  }

  // Try Cloudinary first, fall back to local storage
  if (!isPlaceholderCreds()) {
    try {
      const result = await cloudinary.uploader.upload(img, {
        folder: 'pleasant-yatra',
        resource_type: 'auto',
      });
      if (result && result.secure_url) return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to local:', err.message);
    }
  }

  return saveLocally(img);
}

async function uploadVideo(video) {
  if (typeof video !== 'string') return null;

  // Non base64 values (e.g. pasted URLs) are stored as-is
  if (!video.startsWith('data:video')) return video;

  // Validate file size for base64 videos
  const size = getBase64Size(video);
  if (size > MAX_VIDEO_SIZE) {
    throw new Error(`Video size exceeds 10MB limit`);
  }

  // Try Cloudinary first, fall back to local storage
  if (!isPlaceholderCreds()) {
    try {
      const result = await cloudinary.uploader.upload(video, {
        folder: 'pleasant-yatra',
        resource_type: 'video',
        chunk_size: 6000000, // 6MB chunks for large videos
      });
      if (result && result.secure_url) return result.secure_url;
    } catch (err) {
      console.error('Cloudinary video upload failed, falling back to local:', err.message);
    }
  }

  return saveLocally(video);
}

router.post('/', protect, authorize('admin'), uploadRules, validate, async (req, res) => {
  try {
    const { images, videos } = req.body;
    const imageUrls = [];
    const videoUrls = [];

    if (images && Array.isArray(images)) {
      for (const img of images) {
        const url = await uploadImage(img);
        if (url) imageUrls.push(url);
      }
    }

    if (videos && Array.isArray(videos)) {
      for (const vid of videos) {
        const url = await uploadVideo(vid);
        if (url) videoUrls.push(url);
      }
    }

    res.json({ success: true, data: { images: imageUrls, videos: videoUrls } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
