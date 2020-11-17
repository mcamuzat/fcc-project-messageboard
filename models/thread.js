var mongoose = require("mongoose");


var threadSchema = new mongoose.Schema({
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true},
    text: { type: String, required: true },
    reported: {type: Boolean, default: false},
    delete_password: {type: String, required: true},
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
},
 { timestamps: { createdAt: 'created_on', updatedAt: 'bumped_on' } 
 });


module.exports = mongoose.model('Thread', threadSchema);