const Review = require('../models/reviewModel');

const reviewController = {};

// GET all reviews
reviewController.getAll = async (req, res) => {
    // #swagger.tags = ['Reviews']
    try {
        const result = await Review.find();
        console.log(result)
        if (result.length === 0) {
            return res.status(404).json({ message: 'No reviews found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching reviews',
            error: err.message,
        });
    }
};

// GET review by ID
reviewController.getById = async (req, res) => {
    // #swagger.tags = ['Reviews']
    try {
        const result = await Review.findById(req.params.id);
        if (result) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'Review not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching review',
            error: err.message,
        });
    }
};

// POST new review
reviewController.createReview = async (req, res) => {
    // #swagger.tags = ['Reviews']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    try {
        const newReview = await Review.create({
            user_id: req.body.user_id,
            post_id: req.body.post_id,
            review_date: req.body.review_date,
            review_text: req.body.review_text,
            ratings: req.body.ratings
        });
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to create Review',
            error: err.message,
        });
    }
};

// PUT update Review
reviewController.updateReview = async (req, res) => {
    // #swagger.tags = ['Reviews']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                user_id: req.body.user_id,
                post_id: req.body.post_id,
                review_date: req.body.review_date,
                review_text: req.body.review_text,
                ratings: req.body.ratings
            },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating review',
            error: err.message,
        });
    }
};

// DELETE review
reviewController.deleteReview = async (req, res) => {
    // #swagger.tags = ['Reviews']
    // #swagger.security = [{ "googleOAuth": ["profile", "email"] }]
    try {
        const deletedReview = await Review.deleteOne({ _id: req.params.id });

        if (deletedReview.deletedCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting review',
            error: err.message,
        });
    }
};

module.exports = reviewController;
