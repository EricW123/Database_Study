const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';

async function main() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('client connected');

        const db = client.db(dbName);
        const collection = db.collection('tweet');

        // Qeury 1
        const resq1 = await collection.aggregate([
            {$match: {
                'retweeted_status': {$exists: false},
                'in_reply_to_status_id':null
            }}
        ]).toArray();
        const ansq1 = resq1.length;
        console.log('Result of query1 is ', ansq1);

        // Qeury 2
        const resq2 = await collection.aggregate([
            {$group: {
                _id: '$user.screen_name',
                max_followers_count: {$max: '$user.followers_count'},
            }},
            {$sort: {max_followers_count: -1, _id: 1}},
            {$limit: 10},
            {$project: {
                _id: 0,
                screen_name: '$_id',
                followers_count: 1
            }}
        ]).toArray();
        console.log('Result of query2, the top ten screen names are: ', resq2);

        const resq3 = await collection.aggregate([
            {$match: {
                retweeted_status: {$exists: false},
                in_reply_to_status_id: null
            }},
            {$group: {
                _id: '$user.id',
                screen_name: {$first: '$user.screen_name'},
                tweet_count: {$sum: 1}
            }},
            {$sort: {tweet_count: -1}},
            {$limit: 1},
            {$project: {
                _id: 0,
                user_id: '$_id',
                screen_name: 1,
                tweet_count: '$tweet_count'
            }}
        ]).toArray();
        console.log('Result of query3, the user with most tweets is: ', resq3[0]);

        const resq4 = await collection.aggregate([
            {$group: {
                _id: '$user.id',
                screen_name: {$first: '$user.screen_name'},
                tweet_count: {$sum: 1},
                retweet_avg: {$avg: '$retweet_count'}
            }},
            {$match: {tweet_count: {$gte: 3}}},
            {$sort: {retweet_avg: -1}},
            {$limit: 10},
            {$project: {
                _id: 0,
                user_name: '$screen_name',
                retweet_average: {$round: ['$retweet_avg', 2]}
            }}
        ]).toArray();
        console.log('Result of query4: ', resq4);

        console.log('Result of query5:');

        db.createCollection('Users');
        await collection.aggregate([
            {$match: {
                'user': {$exists: true}
            }},
            {$replaceRoot: {newRoot: '$user'}},
            {$group: {
                _id: '$id',
                user_data: {$first: '$$ROOT'}
            }},
            {$replaceRoot: {newRoot: '$user_data'}},
            {$out: 'Users'}
        ]);
        const u = await db.collection('Users').find().toArray();
        console.log('Users with id: ', u.length);

        db.createCollection('Tweet_UserId');
        await collection.aggregate([
            {$addFields: {
                user: {
                    $cond: {
                        if: {$ne: [{$type: '$user'}, 'missing']},
                        then: '$user.id',
                        else: '$$REMOVE'
                    }
                }
            }},
            {$out: 'Tweet_UserId'}
        ]);
        const t = await db.collection('Tweet_UserId').find().toArray();
        console.log('Tweets with user id: ', t.length);
        //console.log(s[0]);
        //console.log(s[1]);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();
