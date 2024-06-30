const VolunteerOpportunity = require('../models/Volunteer');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

function isFileSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadImageToCloudinary(image, folder) {
  const options = { folder };
  const result = await cloudinary.uploader.upload(image.tempFilePath, options);
  return result;
}

// Create a new volunteer opportunity
exports.createVolunteerOpportunity = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const postalCode = req.user.postalCode;
    const { title, description, date, location } = req.body;

    // Cloudinary image upload
    const image = req.files.image;
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = image.name.split('.').pop().toLowerCase();

    if (!isFileSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    const response = await uploadImageToCloudinary(image, "CommunityConnect");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const volunteerOpportunity = new VolunteerOpportunity({
      title,
      description,
      organization: organizationId,
      date,
      location,
      image: response.secure_url,
      postalCode,
    });

    await volunteerOpportunity.save();
    res.status(201).json({ success: true, data: volunteerOpportunity });
  } catch (error) {
    console.error('Error creating volunteer opportunity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all volunteer opportunities for the user's postal code
exports.getAllVolunteerOpportunities = async (req, res) => {
  try {
    const postalCode = req.user.postalCode;
    const volunteerOpportunities = await VolunteerOpportunity.find({ postalCode }).populate('organization', 'name').sort({ date: 'desc' });
    res.status(200).json({ success: true, data: volunteerOpportunities });
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get volunteer opportunity by ID
exports.getVolunteerOpportunityById = async (req, res) => {
  try {
    const volunteerOpportunity = await VolunteerOpportunity.findById(req.params.id).populate('organization', 'name');
    if (!volunteerOpportunity) {
      return res.status(404).json({ success: false, message: 'Volunteer opportunity not found' });
    }
    res.status(200).json({ success: true, data: volunteerOpportunity });
  } catch (error) {
    console.error('Error fetching volunteer opportunity by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update volunteer opportunity by ID
exports.updateVolunteerOpportunityById = async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const volunteerOpportunity = await VolunteerOpportunity.findById(req.params.id);
    if (!volunteerOpportunity) {
      return res.status(404).json({ success: false, message: 'Volunteer opportunity not found' });
    }

    if (volunteerOpportunity.organization.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updatedVolunteerOpportunity = await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, image },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedVolunteerOpportunity });
  } catch (error) {
    console.error('Error updating volunteer opportunity by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete volunteer opportunity by ID
exports.deleteVolunteerOpportunityById = async (req, res) => {
  try {
    const volunteerOpportunity = await VolunteerOpportunity.findById(req.params.id);
    if (!volunteerOpportunity) {
      return res.status(404).json({ success: false, message: 'Volunteer opportunity not found' });
    }

    if (volunteerOpportunity.organization.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await VolunteerOpportunity.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Volunteer opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer opportunity by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
