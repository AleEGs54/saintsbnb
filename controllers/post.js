const Post = require('../models/post');
const postController = {};

postController.getAll = async (req, res) => {
    try {
        const result = await Post.find();

        if (!result.length === 0) {
            res.status(200).json(result);
            return;
        }
        res.status(404).json({ message: 'Housing/post not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching houses',
            error: err.message,
        });
    }
};

postController.getById = async (req, res) => {
    try {
        const result = await Post.findById(req.params.id);

        if (result.length > 0) {
            res.status(200).json(result);
            return;
        }
        res.status(404).json({ message: 'Housing/post not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching house/post',
            error: err.message,
        });
    }
};

postController.getByLocation = async (req, res) => {
    try {
        const result = await Post.find({ location: req.params.location });
        if (result.length > 0) {
            res.status(200).json(result);
            return;
        }
        res.status(404).json({ message: 'Housing/post not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching house/post',
            error: err.message,
        });
    }
};

postController.createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add Housing/post',
            error: err.message,
        });
    }
};

postController.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.replaceOne(
            { _id: req.params.id },
            req.body,
        );

        if (!updatedPost.acknowledged) {
            res.status(404).json({ message: 'Housing/post not found' });
            return;
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating house/post',
            error: err.message,
        });
    }
};

postController.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.deleteOne({ _id: req.params.id });

        if (!deletedPost.acknowledged) {
            res.status(404).json({ message: 'Housing/post not found' });
            return;
        }
        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting Housing/post',
            error: err.message,
        });
    }
};

module.exports = postController;
