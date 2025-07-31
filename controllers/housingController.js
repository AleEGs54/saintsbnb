// controllers/housingController.js
const HousingModel = require('../models/housingModel');

const housingController = {};

/**
 * @function createHousing
 * @description Creates a new housing post.
 * @param {object} req - Express request object. Expects 'rooms', 'price', 'address', 'maxOccupants', 'user_id' in body.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
housingController.createHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to create a housing post.',
            });
        }

        const housingData = req.body;
        housingData.user_id = req.user._id;

        const newHousing = new HousingModel(housingData);
        await newHousing.save();

        return res.status(201).json({
            message: 'Housing post created successfully!',
            housing: newHousing,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: error.message, errors: error.errors });
        }
        // Always return next(error) to explicitly end execution in the try-catch block
        return next(error);
    }
};

/**
 * @function getAllHousing
 * @description Retrieves all housing posts.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
housingController.getAllHousing = async (req, res, next) => {
    try {
        const housingPosts = await HousingModel.find({}).populate(
            'user_id',
            'name email',
        );
        return res.status(200).json(housingPosts);
    } catch (error) {
        return next(error);
    }
};

/**
 * @function getHousingById
 * @description Retrieves a single housing post by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
housingController.getHousingById = async (req, res, next) => {
    try {
        const housingId = req.params.id;
        const housing = await HousingModel.findById(housingId).populate(
            'user_id',
            'name email',
        );

        if (!housing) {
            return res.status(404).json({ message: 'Housing post not found.' });
        }

        return res.status(200).json(housing);
    } catch (error) {
        return next(error);
    }
};

/**
 * @function updateHousing
 * @description Updates an existing housing post by ID. Only the owner can update.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
housingController.updateHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to update a housing post.',
            });
        }

        const housingId = req.params.id;
        const updateData = req.body;

        const housing = await HousingModel.findById(housingId);

        if (!housing) {
            return res.status(404).json({ message: 'Housing post not found.' });
        }

        // Check if the authenticated user is the owner of the post
        if (housing.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to update this housing post.',
            });
        }

        // Prevent direct modification of user_id through updateData
        if (updateData.user_id) {
            delete updateData.user_id;
        }

        const updatedHousing = await HousingModel.findByIdAndUpdate(
            housingId,
            updateData,
            { new: true, runValidators: true },
        ).populate('user_id', 'name email');

        return res.status(200).json({
            message: 'Housing post updated successfully!',
            housing: updatedHousing,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: error.message, errors: error.errors });
        }
        return next(error);
    }
};

/**
 * @function deleteHousing
 * @description Deletes a housing post by ID. Only the owner can delete.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
housingController.deleteHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to delete a housing post.',
            });
        }

        const housingId = req.params.id;
        const housing = await HousingModel.findById(housingId);

        if (!housing) {
            return res.status(404).json({ message: 'Housing post not found.' });
        }

        // Check if the authenticated user is the owner of the post
        if (housing.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to delete this housing post.',
            });
        }

        await HousingModel.findByIdAndDelete(housingId);

        return res
            .status(200)
            .json({ message: 'Housing post deleted successfully!' });
    } catch (error) {
        return next(error);
    }
};

module.exports = housingController;
