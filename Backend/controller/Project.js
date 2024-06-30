const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

function isFileSupported(type, supportedTypes){
  return supportedTypes.includes(type);
}

async function uploadImageToCloudinary(image, folder){
  const options = { folder };
  console.log("temp", image.tempFilePath);
  const result = await cloudinary.uploader.upload(image.tempFilePath, options);
  return result;
}

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPostalCode = req.user.postalCode;
    const { title, description, startDate, endDate, status} = req.body;

     //cloudinary code
     const image = req.files.image;
     //validation
     const supportedTypes = ["jpg","jpeg","png"];
     const fileType = image.name.split('.')[1].toLowerCase();
     if(!isFileSupported(fileType, supportedTypes)){ 
         return res.status(400).json({
             success: false,
             message:"File format not supported"
         })
     }

     const response = await uploadImageToCloudinary(image, "CommunityConnect");
     
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new project instance
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      status,
      image: response.secure_url,
      organizer: userId,
      postalCode: userPostalCode,
    });

    // Save project to database
    await project.save();

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const userPostalCode = req.user.postalCode;
    const projects = await Project.find({ postalCode: userPostalCode }).populate('organizer', 'name').sort({ date: 'desc' });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('organizer', 'name');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update project by ID
exports.updateProjectById = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, image } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if the user is the organizer of the project
    if (project.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updateData = {
      title,
      description,
      startDate,
      endDate,
      status,
    };

    if (image) {
      updateData.image = image;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Error updating project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if the user is the organizer of the event
    if (project.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};