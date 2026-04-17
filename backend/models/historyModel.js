// ExcelIQ/backend/models/historyModel.js
const { Schema, model } = require('../connection');

const mySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },

    // Naya field add kiya: Reference to uploaded file
    fileId: { type: Schema.Types.ObjectId, ref: 'files', required: false },

    queryType: { type: String, required: true }, // 'formula', 'explain', ya 'chat'
    prompt: { type: String, required: true },
    response: { type: String, required: true },
}, { timestamps: true });

module.exports = model('history', mySchema);