// Verification middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

// Middleware to check if the user is the same as the requested user or an admin
const isSelfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ error: 'Unauthorized access: User not authenticated.' });
    }

    // Convert IDs to the same type for comparison.
    const authenticatedUserId = req.user._id.toString();
    const requestedUserId = req.params.id.toString();

    // Allow if it is the user's own profile OR if the user is an admin.
    if (authenticatedUserId === requestedUserId || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            error: 'Access denied: You do not have permission to modify this user.',
        });
    }
};

// Middleware to prevent a non-admin user from changing their own role
const preventRoleChange = (req, res, next) => {
    // If there is no role change in the request body, allow it to pass.
    if (!req.body.role) {
        return next();
    }

    // Check if the new role being requested is 'admin' or includes it.
    const newRole = req.body.role;
    const isNewRoleAdmin = Array.isArray(newRole)
        ? newRole.includes('admin')
        : newRole === 'admin';

    // If the user making the request is an admin, they can perform any role change.
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    // If the new role is 'admin' and the user is NOT an admin, return a forbidden error.
    if (isNewRoleAdmin) {
        return res.status(403).json({
            message: 'Forbidden: Only an admin can assign the "admin" role.',
        });
    }

    // For all other role changes (e.g., guest to host, host to guest), allow them.
    return next();
};

module.exports = { isAdmin, preventRoleChange, isSelfOrAdmin };
