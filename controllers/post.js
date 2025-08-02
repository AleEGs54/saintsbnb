const Post = require('../models/postModel');

const postController = {};

// GET all posts
postController.getAll = async (req, res) => {
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

// POST new post
postController.createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
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
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
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
