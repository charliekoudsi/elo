#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const {
  addPlayer,
  getRankings,
  playGame,
  showRankings,
  updateName
} = require('.');

const questions = [
  {
    type: 'input',
    name: 'playerOne',
    message: "First Player's Name"
  },
  {
    type: 'input',
    name: 'playerTwo',
    message: "Second Player's Name"
  },
  {
    type: 'input',
    name: 'playerOneScore',
    message: "First Player's Score"
  },
  {
    type: 'input',
    name: 'playerTwoScore',
    message: "Second Player's Score"
  }
];

program.version('1.0.0').description("Bilo's ELO");

program
  .command('add <name>')
  .alias('a')
  .description('Add a new player')
  .action(function(name) {
    console.log(name);
    addPlayer(name);
  });

program
  .command('rank')
  .alias('r')
  .description('Show rankings')
  .action(async function() {
    const players = await getRankings();
    showRankings(players);
  });

program
  .command('game')
  .alias('g')
  .description('Add the results of a game')
  .action(function() {
    prompt(questions).then(async function(answers) {
      playGame(answers);
    });
  });

program
  .command('update-name <originalName> <newName>')
  .alias('u')
  .description('Update a name')
  .action(async function(originalName, newName) {
    await updateName(originalName, newName);
  });

program.parse(process.argv);
