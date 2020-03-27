/* app.js
 * takes in liveVideoId from cmd line and passes it to triviaBot
 */

const process = require('process');
const triviaBot = require('./triviaBot');

let liveVideoId = process.argv[2];

console.log(liveVideoId);

triviaBot.askQuestion();