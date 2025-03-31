const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
     // Simulate a logged-in user
     req.user = { id: "60d5ec49f5ee810015ebc3f1" }; // Fake user ID
     next();
};
// neee to add
/*** const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    } */