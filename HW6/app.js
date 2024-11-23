import { createClient } from 'redis';
import { getTweets } from './db/myMongoDB.js';

// Create a new Redis client
const client = createClient({
  host: 'localhost',
  port: 6379
});

// Log when the client is connected
client.on('connect', () => {
  console.log('Redis Connected');
});

// Log when the client is connected
client.on('error', (err) => {
  console.error('Redis connection failed: ', err);
});

await client.connect();
await client.flushAll();

const tweets = await getTweets();

// Query 1: count tweets
client.set('tweetCount', 0);
for (let t of tweets) {
  await client.incr('tweetCount');
}

console.log(`Query 1: There were ${await client.get('tweetCount')} tweets`);


// Query 2: count favorite counts
client.set('favoritesSum', 0);
for (let t of tweets) {
    await client.incrBy('favoritesSum', t["favorite_count"]);
}

console.log(`Query 2: The sum of favorites is ${await client.get('favoritesSum')}`);


// Query 3: count distinct users
// Create a set to store distinct users
await client.del('distinctUsers');
for (let t of tweets) {
    await client.sAdd('distinctUsers', t["user"]["screen_name"]);
}

console.log(`Query 3: There are ${await client.sCard('distinctUsers')} distinct users`);


// Query 4: count tweets per user
// Create a leaderboard to store the number of tweets per user
await client.del('tweetsPerUser');
for (let t of tweets) {
    await client.zIncrBy('tweetsPerUser', 1, t["user"]["screen_name"]);
}

console.log('Query 4: Tweets per user');
const topUsers = await client.zRangeWithScores('tweetsPerUser', '+inf', '-inf', {
    BY: 'SCORE',
    REV: true,
    LIMIT: { offset: 0, count: 10 }
});
for (let u of topUsers) {
    console.log(`    User: ${u.value}, Tweets: ${u.score}`);
}

// Query 5: collect tweets per user
await client.del('tweet');
await client.del('tweets');
for (let t of tweets) {
    const tweet_key = "tweet:" + t["id_str"];
    const user_key = "tweets:" + t["user"]["screen_name"];

    let fv = Object.entries(t);
    fv = fv.reduce((acc, [field, value]) => acc.concat(String(field), String(value)), []);
    await client.hSet(tweet_key, fv);
    await client.lPush(user_key, String(t["id"]));
}

console.log('Query 5 finished, see the results in RedisInsight');

client.quit();
