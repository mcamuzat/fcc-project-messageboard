var mongoose = require("mongoose");

var replySchema = new mongoose.Schema({
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    text: { type: String, required: true },
    reported: {type: Boolean, default: false},
    delete_password: {type: String, required: true},
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } });

module.exports = mongoose.model('Reply', replySchema);