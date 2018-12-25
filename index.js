const Twit = require('twit');
const dotenv = require('dotenv');
const Sentiment = require('sentiment');
var sentiment = new Sentiment();
const colors = require('colors/safe');

dotenv.config();

const {
    CONSUMER_KEY,
    CONSUMER_SECRET,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET
} = process.env;

const config_twiiter = {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token: ACCESS_TOKEN,
    access_token_secret: ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000
}

let api = new Twit(config_twiiter);

function get_text(tweet){
    let txt = tweet.retweeted_status ? tweet.retweeted_status.full_text : tweet.full_text;
    return txt.split(/ | \n/).filter(v => !v.startsWith('http')).join(' ');
}

async function get_tweets(q, count){
    let tweets = await api.get('search/tweets', {q, count, tweet_mode: 'extended'});
    return tweets.data.statuses.map(get_text);
}

async function main() {
    let keyword = "xxxxxx";
    let count = 10;
    let tweets = await get_tweets(keyword, count);
    for (tweet of tweets) {
        let score = sentiment.analyze(tweet).comparative;
        tweet = `${tweet}\n`;
        if (score > 0){
            tweet = colors.green(tweet);
        }else if(score < 0){
            tweet = colors.red(tweet);
        }else {
            tweet = colors.blue(tweet);
        }
        console.log(tweet, score);
    }
}

main();