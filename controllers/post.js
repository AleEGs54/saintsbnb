const Post = require('../models/postModel');

const postController = {};

// GET all posts
postController.getAll = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.description = 'Retrieve a list of all posts.'
    // #swagger.summary = 'Get all posts'
    try {
        const result = await Post.find();
        if (result.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching posts',
            error: err.message,
        });
    }
};

// GET post by ID
postController.getById = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.description = 'Retrieve a post by its ID.'
    // #swagger.summary = 'Get post by ID'
    try {
        const result = await Post.findById(req.params.id);
        if (result) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'Post not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching post',
            error: err.message,
        });
    }
};

// GET posts by location
postController.getByLocation = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.description = 'Retrieve posts filtered by location.'
    // #swagger.summary = 'Get posts by location'
    try {
        const result = await Post.find({ location: req.params.location });
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'No posts found for this location' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching posts by location',
            error: err.message,
        });
    }
};

// GET posts by availability
postController.getByAvailability = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.description = 'Retrieve posts filtered by availability.Parameter: true = available, false = not available.'
    // #swagger.summary = 'Get posts by availability'
    try {

        if (req.params.status !== 'true' && req.params.status !== 'false') {
            return res.status(404).json({ message: 'Invalid availability status. Must be either true or false.' });
        }

        const result = await Post.find({ availability: req.params.status });
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'No posts found for this availability' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching posts by availability',
            error: err.message,
        });
    }
};

// POST new post
postController.createPost = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Create a new post.'
    // #swagger.summary = 'Create a new post'
    try {
        const newPost = await Post.create({
            user_id: req.body.user_id,
            rooms: req.body.rooms,
            availability: req.body.availability,
            description: req.body.description,
            owner: req.body.owner,
            price: req.body.price,
            address: req.body.address,
            max_occupants: req.body.max_occupants,
            location: req.body.location,
        });
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to create post',
            error: err.message,
        });
    }
};

// PUT update post
postController.updatePost = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Update an existing post by ID.'
    // #swagger.summary = 'Update post by ID'
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                user_id: req.body.user_id,
                rooms: req.body.rooms,
                availability: req.body.availability,
                description: req.body.description,
                owner: req.body.owner,
                price: req.body.price,
                address: req.body.address,
                max_occupants: req.body.max_occupants,
                location: req.body.location,
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating post',
            error: err.message,
        });
    }
};

// DELETE post
postController.deletePost = async (req, res) => {
    // #swagger.tags = ['Posts']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    // #swagger.description = 'Delete a post by ID.'
    // #swagger.summary = 'Delete post by ID'
    try {
        const deletedPost = await Post.deleteOne({ _id: req.params.id });

        if (deletedPost.deletedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting post',
            error: err.message,
        });
    }
};

module.exports = postController;
