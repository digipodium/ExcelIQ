const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName:  { type: String, required: true },
    lastName:   { type: String, default: '' },
    email:      { type: String, required: true },
    message:    { type: String, required: true },
    status:     { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    adminReply: { type: String, default: '' },
    repliedAt:  { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
