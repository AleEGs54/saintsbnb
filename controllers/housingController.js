const Housing = require('../models/housingModel');

const housingController = {};

// Create a new housing listing
housingController.createHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to create a housing listing.',
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
            userId: req.user._id,
        };

        const newHousing = new Housing(housingData);
        await newHousing.save();

        return res.status(201).json({
            message: 'Housing listing created successfully!',
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

// Get all housing listings
housingController.getAllHousing = async (req, res, next) => {
    try {
        const housings = await Housing.find({}).populate(
            'userId',
            'name email',
        );
        return res.status(200).json(housings);
    } catch (error) {
        return next(error);
    }
};

// Get housing listing by ID
housingController.getHousingById = async (req, res, next) => {
    try {
        const housing = await Housing.findById(req.params.id).populate(
            'userId',
            'name email',
        );
        if (!housing) {
            return res
                .status(404)
                .json({ message: 'Housing listing not found.' });
        }
        return res.status(200).json(housing);
    } catch (error) {
        return next(error);
    }
};

housingController.updateHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to update a housing listing.',
            });
        }

        const housing = await Housing.findById(req.params.id);

        if (!housing) {
            return res
                .status(404)
                .json({ message: 'Housing listing not found.' });
        }

        if (housing.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to update this housing listing.',
            });
        }

        const updatedHousing = await Housing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        ).populate('userId', 'name email');

        return res.status(200).json({
            message: 'Housing listing updated successfully!',
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

// Delete housing listing by ID
housingController.deleteHousing = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Authentication required to delete a housing listing.',
            });
        }

        const housing = await Housing.findById(req.params.id);

        if (!housing) {
            return res
                .status(404)
                .json({ message: 'Housing listing not found.' });
        }

        if (housing.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message:
                    'Forbidden: You do not have permission to delete this housing listing.',
            });
        }

        await Housing.findByIdAndDelete(req.params.id);

        return res
            .status(200)
            .json({ message: 'Housing listing deleted successfully!' });
    } catch (error) {
        return next(error);
    }
};

module.exports = housingController;
