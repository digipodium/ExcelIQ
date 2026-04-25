const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const FileModel = require('../models/fileModel');
const UserModel = require('../models/usermodel');
const ContactModel = require('../models/contactModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

// GET overall system stats
router.get('/system-stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalFiles = await FileModel.countDocuments();
        const totalQueries = await ContactModel.countDocuments();
        const pendingQueries = await ContactModel.countDocuments({ status: 'pending' });

        res.status(200).json({
            totalUsers,
            totalFiles,
            totalQueries,
            pendingQueries
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

// ── CONTACT QUERIES ──────────────────────────────────────────────────────────

// GET all contact queries (for admin dashboard)
router.get('/contacts', adminAuth, async (req, res) => {
    try {
        const contacts = await ContactModel.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST reply to a contact query (sends email and updates status)
router.post('/contacts/:id/reply', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply || !reply.trim()) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact query not found' });
        }

        // Send reply email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"ExcelIQ Support" <${process.env.EMAIL_USER}>`,
            to: contact.email,
            subject: `Re: Your inquiry to ExcelIQ`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 20px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0;">ExcelIQ Support</h2>
                    </div>
                    <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="color: #475569; margin-bottom: 8px;">Hi <strong>${contact.firstName}</strong>,</p>
                        <p style="color: #475569; margin-bottom: 16px;">Thank you for reaching out to us. Here is our response to your inquiry:</p>
                        
                        <div style="background: white; border-left: 4px solid #4F46E5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                            <p style="color: #1e293b; margin: 0; white-space: pre-wrap;">${reply}</p>
                        </div>

                        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 4px;"><strong>Your original message:</strong></p>
                        <p style="color: #94a3b8; font-size: 12px; font-style: italic;">"${contact.message}"</p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">— ExcelIQ Team</p>
                    </div>
                </div>
            `
        });

        // Update the contact record
        contact.status = 'resolved';
        contact.adminReply = reply;
        contact.repliedAt = new Date();
        await contact.save();

        res.status(200).json({ message: 'Reply sent successfully and query marked as resolved.' });
    } catch (error) {
        console.error('Error replying to contact:', error);
        res.status(500).json({ message: 'Failed to send reply email.' });
    }
});

module.exports = router;
