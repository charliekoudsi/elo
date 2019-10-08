const mongoose = require('mongoose');
const { EloCalculator } = require('toefungi-elo-calculator');
const db = require('./models');

const eloCalculator = new EloCalculator();

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
  const player1 = await db.Player.findOne({ name: result.playerOne });
  const player2 = await db.Player.findOne({ name: result.playerTwo });
  const scoreDiff1 = result.playerOneScore - result.playerTwoScore;
  const scoreDiff2 = result.playerTwoScore - result.playerOneScore;
  await updateScore(
    result.playerOne,
    await eloCalculator.calculateElo(
      player1.score,
      player2.score,
      0.5 + 0.5 * Math.sign(scoreDiff1),
      Math.abs(scoreDiff1)
    )
  );
  await updateScore(
    result.playerTwo,
    await eloCalculator.calculateElo(
      player2.score,
      player1.score,
      0.5 + 0.5 * Math.sign(scoreDiff2),
      Math.abs(scoreDiff2)
    )
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
