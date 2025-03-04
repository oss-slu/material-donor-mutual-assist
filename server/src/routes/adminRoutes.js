const express = require('express');
const { verifyToken, checkRole } = require('../services/authService');
const router = express.Router();

router.get('/admin-dashboard', verifyToken, checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
