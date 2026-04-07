const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const FileModel = require('../models/fileModel');
const UserModel = require('../models/usermodel');

// GET overall system stats
router.get('/system-stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalFiles = await FileModel.countDocuments();

        res.status(200).json({
            totalUsers,
            totalFiles
        });
    } catch (error) {
        console.error('Error fetching system stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET all users (excluding passwords)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE a specific user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'User removed from system successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error deleting user' });
    }
});

module.exports = router;
