
const { Schema, model } = require('../connection');

const mySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },


    fileId: { type: Schema.Types.ObjectId, ref: 'files', required: false },

    queryType: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
}, { timestamps: true });

module.exports = model('history', mySchema);