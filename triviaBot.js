/* triviaBot 
 * Connects to trivia database, displays questions
 * and checks fb live comments for answers picking the winner
 * then moving to the next question
 * 
 * API GET call to https://opentdb.com/api.php will only be calling one question at a time
 * via https://opentdb.com/api.php?amount=1
 * 
 * You will need to create a fb app for this bot to use then create an access token connecting that app to
 * the page with the livestream
 */

/* askQuestion
 * Asks a question from open trivia db
*/
const askQuestion = async (liveVideoId) => {
    const axios = require('axios');
    const chalk = require('chalk');
    const decode = require('unescape');
    const config = require('./config');
    const moment = require('moment');
    const FB = require('fb');
    let questionData;
    let questionAskDT = moment.utc() // date and time when question was asked
    
    // get question from triviadb
    await axios.get('https://opentdb.com/api.php?amount=1')
    .then((resp) => {
        if(resp.data.response_code === 0) {
            questionData = resp.data.results[0];
        } else {
            console.error('Error unknown response from API');
        }
    }).catch((error) => {
        console.log('Error with GET to API');
        console.error(error);
    });

    console.log(questionData);

    // format question data to be asked
    let questionText;
    if (questionData.type === 'boolean') {
        questionText = chalk.hex('#ffffff').bgHex('#000000').bold(
            '[True/False] ' + decode(questionData.question).replace('&#039;','\'')
        );
    } else {
        questionText = chalk.hex('#ffffff').bgHex('#000000').bold(
            decode(questionData.question).replace('&#039;','\'')
        );
    }
    
    console.log(chalk.bgHex('#666666')(
        '                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        '
    ));
    console.log(chalk.bgHex('#000')(
        '                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        '
    ));
    console.log(questionText);
    console.log(chalk.bgHex('#444')(
        '                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        '
    ));
    console.log(chalk.bgHex('#888888')(
        '                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        \n                                                                                                            \
        '
    ));

    // wait and check for answers from fb live comments
    // for comments "/{live-video-id}/comments"
    // for video data "/{live-video-id}"
    await FB.api(
        '/'+config.liveVideoId+'/comments',
        {since: questionAskDT.unix(), access_token: config.accessToken},
        (resp) => {
            // go through chat data since last question asked and look for answer
            console.log(resp);
            console.log(questionAskDT.unix());
            console.log(moment.utc(resp.data[0].created_time).unix());
        }
    )

}

exports.askQuestion = askQuestion;