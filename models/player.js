const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  score: {
    type: Number,
    default: 1000
  }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
