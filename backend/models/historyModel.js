const {Schema, model} = require('../connection');

const mySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    queryType: { type: String, required: true }, // e.g. 'formula' or 'data-insight'
    prompt: { type: String, required: true },
    response: { type: String, required: true },
}, { timestamps: true });

module.exports = model('history', mySchema);
