const mongoose = require('mongoose');
const EloRank = require('elo-rank');
const db = require('./models');

const elo = new EloRank();

exports.addPlayer = function(name) {
  db.Player.create({ name }).then(function() {
    mongoose.connection.close();
  });
};

async function updateScore(name, score) {
  await db.Player.findOneAndUpdate({ name }, { score });
}

exports.updateName = async function(originalName, newName) {
  await db.Player.findOneAndUpdate({ name: originalName }, { name: newName });
  mongoose.connection.close();
};

exports.getRankings = async function() {
  const players = await db.Player.find().sort({ score: -1 });
  mongoose.connection.close();
  return players;
};

exports.playGame = async function(result) {
  const winner = await db.Player.findOne({ name: result.winner });
  const loser = await db.Player.findOne({ name: result.loser });
  const expectedScoreWinner = elo.getExpected(winner.score, loser.score);
  const expectedScoreLoser = elo.getExpected(loser.score, winner.score);
  await updateScore(
    result.winner,
    elo.updateRating(expectedScoreWinner, 1, winner.score)
  );
  await updateScore(
    result.loser,
    elo.updateRating(expectedScoreLoser, 0, loser.score)
  );
  mongoose.connection.close();
};

exports.showRankings = function(players) {
  console.log(`${'Rank'.padEnd(15)}${'Name'.padEnd(15)}${'ELO'.padEnd(15)}`);
  for (let i = 0; i < players.length; i++) {
    const rank = `${i + 1}.`;
    let { name, score } = players[i];
    name += '';
    score += '';
    console.log(`${rank.padEnd(15)}${name.padEnd(15)}${score.padEnd(15)}`);
  }
};
