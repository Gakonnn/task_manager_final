const roleAuth = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).send({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = roleAuth;
