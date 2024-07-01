const Event = require('../models/Event');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

function isFileSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadImageToCloudinary(image, folder){
    const options = { folder };
    const result = await cloudinary.uploader.upload(image.tempFilePath, options);
    return result;
}

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const userPostalCode = req.user.postalCode;
        const { title, description, date, location} = req.body;
        
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
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const event = new Event({
            title,
            description,
            date,
            location,
            image: response.secure_url,
            organizer: userId,
            postalCode: userPostalCode
        });

        await event.save();
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all events for the user's postal code
exports.getAllEvents = async (req, res) => {
    try {
        const userPostalCode = req.user.postalCode;
        const events = await Event.find({ postalCode: userPostalCode }).populate('organizer', 'name').sort({ date: 'desc' });

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const userId = req.user.id;
        const event = await Event.find({organizer: userId}).populate('organizer', 'name');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update event by ID
exports.updateEventById = async (req, res) => {
    try {
        const { title, description, date, location} = req.body;

        let image;
        let response;
        //cloudinary code
        if(req.files.image){
          image = req.files.image;
        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = image.name.split('.')[1].toLowerCase();
        if(!isFileSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message:"File format not supported"
            })
        }
        response = await uploadImageToCloudinary(image, "CommunityConnect");
    }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if the user is the organizer of the event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updateevent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, image: response.secure_url },
            { new: true }
        );

        res.status(200).json({ success: true, data: updateevent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete event by ID
exports.deleteEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if the user is the organizer of the event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};