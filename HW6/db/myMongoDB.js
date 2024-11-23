import { MongoClient } from "mongodb";
// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

export async function getTweets(query = {}) {
    const client = new MongoClient(uri);
    try {
        const database = client.db("tweets");
        const collection = database.collection("tweets");
        // Query for a movie that has the title 'Back to the Future'

        return await collection.find(query).toArray();
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

