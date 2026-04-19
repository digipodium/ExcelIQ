const { Schema, model } = require('../connection');

const mySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    status: { type: String, default: 'uploaded' },

    sheetName: { type: String, default: 'Sheet1' },
    rowCount: { type: Number, default: 0 },
    columnCount: { type: Number, default: 0 },
    commandCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('files', mySchema);
