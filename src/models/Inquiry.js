const mongoose = require("mongoose");

const inquiryTypes = ["package", "flight", "hotel", "bus", "cab", "service"];

const InquirySchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: inquiryTypes,
      default: "package",
    },
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
    },
    phone: {
      type: String,
      required: [true, "Please add your phone number"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    travelDate: Date,
    travelers: Number,
    message: String,
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    source: {
      type: String,
      enum: ["website", "whatsapp", "phone", "email"],
      default: "website",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
    notes: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Inquiry", InquirySchema);
