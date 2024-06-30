const News = require('../models/News');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

function isFileSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadImageToCloudinary(image, folder) {
    const options = { folder };
    console.log("temp", image.tempFilePath);
    const result = await cloudinary.uploader.upload(image.tempFilePath, options);
    return result;
}

// Create a new news article
exports.createNews = async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.name; // Assuming the user name is stored in req.user
        const userPostalCode = req.user.postalCode;
        const { title, content } = req.body;

        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if file exists
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        // Cloudinary code
        const image = req.files.image;

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = image.name.split('.').pop().toLowerCase();

        if (!isFileSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        const response = await uploadImageToCloudinary(image, "CommunityConnect");
        
        const news = new News({
            title,
            content,
            author: userId,
            authorName: userName,
            postalCode: userPostalCode,
            image: response.secure_url,
        });

        await news.save();
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all news articles for the user's postal code
exports.getAllNews = async (req, res) => {
    try {
        const userPostalCode = req.user.postalCode;
        const newsArticles = await News.find({ postalCode: userPostalCode }).populate('author', 'name').sort({ createdAt: 'desc' });

        res.status(200).json({ success: true, data: newsArticles });
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get news article by ID
exports.getNewsById = async (req, res) => {
    try {
        const userId = req.user.id;
        const newsArticle = await News.find({author: userId}).populate('author', 'name');
        if (!newsArticle) {
            return res.status(404).json({ success: false, message: 'News article not found' });
        }
        res.status(200).json({ success: true, data: newsArticle });
    } catch (error) {
        console.error('Error fetching news article by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update news article by ID
exports.updateNewsById = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Cloudinary code
        const image = req.files.image;

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = image.name.split('.').pop().toLowerCase();

        if (!isFileSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        const response = await uploadImageToCloudinary(image, "CommunityConnect");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newsArticle = await News.findById(req.params.id);
        if (!newsArticle) {
            return res.status(404).json({ success: false, message: 'News article not found' });
        }

        // Check if the user is the author of the news article
        if (newsArticle.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        let updatedFields = { title, content };

        // Handle image update
        if (req.files && req.files.image) {
            const image = req.files.image;
            console.log('Image:', image);

            const supportedTypes = ["jpg", "jpeg", "png"];
            const fileType = image.name.split('.').pop().toLowerCase();
            console.log('File Type:', fileType);

            if (!isFileSupported(fileType, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: "File format not supported"
                });
            }

            const response = await uploadImageToCloudinary(image, "CommunityConnect");
            console.log('Cloudinary Response:', response);

            updatedFields.image = response.secure_url;
        }

        const updatedNewsArticle = await News.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        res.status(200).json({ success: true, data: updatedNewsArticle });
    } catch (error) {
        console.error('Error updating news article:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete news article by ID
exports.deleteNewsById = async (req, res) => {
    try {
        const newsArticle = await News.findById(req.params.id);
        if (!newsArticle) {
            return res.status(404).json({ success: false, message: 'News article not found' });
        }

        // Check if the user is the author of the news article
        if (newsArticle.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await News.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'News article deleted successfully' });
    } catch (error) {
        console.error('Error deleting news article:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};