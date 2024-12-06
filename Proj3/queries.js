const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'fms';

async function main() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('client connected');

        const db = client.db(dbName);

        const resq1 = await db.collection('factories').aggregate([
            {$project: {
                factory_id: 1,
                factory_name: 1,
                prodLines: {$size: '$prodlines'}
            }}
        ]).toArray();
        console.log("Query 1 - Number of ProdLines in each Factory:");
        console.log(JSON.stringify(resq1, null, 2));

        const resq2 = await db.collection('machines').find({
            $or: [
                { "anomaly_records.fixed_by_team": null },
                { "anomaly_records.fixed_by_team": "null" },
                { "conditions.cond_expr": { $regex: "temp > 100" } }
            ]
        }).toArray();
        console.log("Query 2 - Machines with unfixed issue or temperature too high:");
        console.log(JSON.stringify(resq2, null, 2));
        
        const firstTeam = await db.collection('teams').findOne({});
        const resq3 = await db.collection('teams').aggregate([
            { $match: { team_id: firstTeam.team_id } },
            { $project: { fixed_count: { $size: "$fixed_records" } } }
        ]).toArray();
        console.log(`Query 3 - Anomalies fixed by Team #${firstTeam.team_id}:`);
        console.log(JSON.stringify(resq3, null, 2));

        const firstBadMach = await db.collection('teams').findOne({$or: [
            {"anomaly_records.fixed_by_team": "null"},
            {"anomaly_records.fixed_by_team": null}
        ]});
        if (firstBadMach) {
            const resq4 = await db.collection('machines').updateOne(
                { "machine_id": firstBadMach.machine_id,
                    $or: [{"anomaly_records.fixed_by_team": null}, {"anomaly_records.fixed_by_team": "null"}] },
                { $set: { "anomaly_records.fixed_by_team": 147 } }
            );
            console.log(`Query 4 - Fixed anomalies for Machine #${firstBadMach.machine_id}:`);
            console.log(JSON.stringify(resq4, null, 2));
        }

        const firstFac = await db.collection('factories').findOne({});
        const resq5 = await db.collection('machines').find(
            {
                factory_id: firstFac.factory_id,
                $or: [
                     { "anomaly_records.fixed_by_team": "null" }, 
                     {"anomaly_records.fixed_by_team": null }
                ]
            },
            {
                projection: {
                    machine_id: 1,
                    anomaly_records: { $elemMatch: { fixed_by_team: null } }
                }
            }
        ).toArray();
        console.log("Qeury 5 - Machines in Factory #1 with unfixed anomalies:");
        console.log(JSON.stringify(resq5, null, 2));        
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();
