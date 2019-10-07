const mongoose = require('mongoose');

// mongoose.set('debug', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/elo');

mongoose.Promise = Promise;

module.exports.Player = require('./player');
