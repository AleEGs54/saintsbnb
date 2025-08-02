// controllers/housingController.js
const HousingModel = require('../models/housingModel');
const housingController = {};

// create a new housing post
housingController.createHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to create a housing post.',
            });
        }

        const {
            rooms,
            availability,
            price,
            address,
            maxOccupants,
            features,
            description,
            images,
        } = req.body;

        const housingData = {
            rooms,
            availability,
            price,
            address,
            maxOccupants,
            features,
            description,
            images,
            user_id: req.user._id,
        };

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
        return next(error);
    }
};

// get all housing posts
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

// get housing post by ID
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

// update an existing housing post by ID
housingController.updateHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to update a housing post.',
            });
        }

        const housingId = req.params.id;
        const {
            rooms,
            availability,
            price,
            address,
            maxOccupants,
            features,
            description,
            images,
        } = req.body;

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

        const updateData = {
            rooms,
            availability,
            price,
            address,
            maxOccupants,
            features,
            description,
            images,
        };

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

// delete a housing post by ID
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
