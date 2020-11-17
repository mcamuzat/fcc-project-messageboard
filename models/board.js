var mongoose = require("mongoose");

var boardSchema = new mongoose.Schema({
    name: { type: String, required: true},
});

module.exports = mongoose.model('Board', boardSchema);