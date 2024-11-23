# Assignment 6 / Use Redis with Node

## Overview

In this assignment you will be using Node to interact with an in-memory Redis Database. For this we will be building on the Mongo Database you used for Assignment 5.

## How to use

* Download the dataset by visiting <https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2>.
* Unzip the file with tools like 7zip or bzip2. This should give a `.dump` file.
* Imoprt the file using mongoimport
  * `mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump`
* Start the Redis stack server in docker by running
  * `docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
  * Then visit <http://localhost:8001/> to see the Redis Insight
* In this folder (HW6), run `npm install` to install required node modules.
* Run `node app.js`, then the query results should be shown in terminal logs.
  * Specially, query 5 has barely any output, the results are stored in the Redis database.

## Tasks

* Query1: How many tweets are there? Create a tweetCount key that contains the total number of tweets in the database. For this, initialize tweetCount in 0 (SET), then query the tweets collection in Mongo and increase (INCR) tweetCount. Once the query is done, get the last value of tweetCount (GET) and print it in the console with a message that says "There were ### tweets", with ### being the actual number
* Query2: Compute and print the total number of favorites in the dataset. For this apply the same process as before, query all the tweets, start a favoritesSum key (SET), increment it by the number of favorites on each tweet (INCRBY), and then get the value (GET) and print it on the screen.
* Query3: Compute how many distinct users are there in the dataset. For this use a set by the screen_name, e.g. screen_names
Query4: Create a leaderboard with the top 10 users with more tweets. Use a sorted set called leaderboard
* Query5: Create a structure that lets you get all the tweets for an specific user. Use lists for each screen_name e.g. a list with key tweets:duto_guerra that points to a list of all the tweet ids for duto_guerra, e.g. [123, 143, 173, 213]. and then a hash that links from tweetid to the tweet information e.g. tweet:123 which points to all the tweet attributes (i.e. user_name, text, created_at, etc)
