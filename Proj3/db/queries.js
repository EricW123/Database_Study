const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const EXPIRE_TIME = 10;

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let fms = null;
let redis = null;

async function connect() {
    if (fms == null) {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        fms = client.db("fms");
        console.log("Connected to database fms");
    }

    if (redis == null) {
        redis = createClient();
        redis.on("error", (err) => {
            console.log("Error " + err);
        });
        await redis.connect();
        console.log("Connected to redis");
        redis.flushAll();
    }
}

async function getFactories() {
    await connect();

    if (await redis.get("factories:cached")) {
        let res = await redis.hGetAll("facs");
        res = Object.keys(res).map((key) => ({ factory_id: key, factory_name: res[key] }));
        console.log(" >> Got [factories] from cache");
        return res;
    }

    console.log(" >> Getting [factories] from mongodb");
    const facs = await fms.collection("factories");
    const res = await facs.aggregate([
        {$project: {
            factory_id: 1,
            factory_name: 1
        }},
    ]).toArray();

    for (let fac of res) {
        await redis.hSet("facs", fac.factory_id, fac.factory_name);
    }
    await redis.set("factories:cached", "true", {"EX": EXPIRE_TIME});
    return res;
}

async function getProdLines(id) {
    await connect();

    if (await redis.get(`prodlines:${id}:cached`)) {
        let res = await redis.hGetAll(`pls:${id}`);
        res = Object.keys(res).map((key) => ({ pl_id: key, factory_id: res[key] }));
        console.log(" >> Got [prodlines] from cache");
        return res;
    }

    console.log(" >> Getting [prodlines] from mongodb");
    const facs = await fms.collection("factories");
    const res = await facs.aggregate([
        {$match: { factory_id: id }},
        {$project: {
            prodlines: 1
        }},
        {$unwind: "$prodlines"},
        {$replaceRoot: { newRoot: "$prodlines" }},
        {$project: {
            pl_id: "$prodline_id",
            factory_id: id,
        }}
    ]).toArray();

    for (let pl of res) {
        await redis.hSet(`pls:${id}`, pl.pl_id, pl.factory_id);
    }
    await redis.set(`prodlines:${id}:cached`, "true", {"EX": EXPIRE_TIME});
    return res;
}

async function getMachines(id) {
    await connect();

    let res = null;
    if (await redis.get(`machines:${id}:cached`)) {
        res = await redis.hGetAll(`machs:${id}`);
        res = Object.keys(res).map((key) => ({ machine_id: key, pl_id: res[key] }));
        console.log(" >> Got [machines] from cache");
    } else {
        console.log(" >> Getting [machines] from mongodb");
        const facs = await fms.collection("factories");
        res = await facs.aggregate([
            {$unwind: "$prodlines"},
            {$match: { "prodlines.prodline_id": parseInt(id) }},
            {$project: {
                factory_id: 1,
                pl_id: "$prodlines.prodline_id",
                machines: "$prodlines.machines"
            }},
            {$unwind: "$machines"},
            {$project: {
                pl_id: 1,
                machine_id: "$machines.machine_id",
            }}
        ]).toArray();
        for (let mach of res) {
            await redis.hSet(`machs:${id}`, mach.machine_id, mach.pl_id);
        }
        await redis.set(`machines:${id}:cached`, "true", {"EX": EXPIRE_TIME});
    }

    for (let mach of res) {
        mach.status = await redis.get(`machines:${mach.machine_id}:status`);
    }

    return res;
}

async function getAssertions(id) {
    await connect();

    const machs = await fms.collection("machines");
    const res = await machs.aggregate([
        {$match: { machine_id: parseInt(id) }},
        {$project: {
            conditions: 1
        }},
        {$unwind: "$conditions"},
        {$replaceRoot: { newRoot: "$conditions" }},
        {$project: {
            cond_id: 1,
            cond_expr: 1
        }}
    ]).toArray();
    return res;
}

async function getRecords(id) {
    await connect();

    const machs = await fms.collection("machines");
    const res = await machs.aggregate([
        {$match: { machine_id: parseInt(id) }},
        {$project: {
            anomaly_records: 1
        }},
        {$unwind: "$anomaly_records"},
        {$replaceRoot: { newRoot: "$anomaly_records" }},
        {$lookup: {
            from: "teams",
            localField: "fixed_by_team",
            foreignField: "team_id",
            as: "fixed_team"
        }},
        {$unwind: {
            path: "$fixed_team",
            preserveNullAndEmptyArrays: true
        }},
        {$project: {
            record_id: 1,
            time: 1,
            reason: 1,
            team_leader: {
                $cond: {
                    if: { $ne: ["$fixed_by_team", "null"] },
                    then: "$fixed_team.team_leader",
                    else: "null"
                }
            }
        }}
    ]).toArray();

    let status = "ok";
    for (let rec of res) {
        if (rec.team_leader == null) {
            status = "not ok";
            break;
        }
    }
    await redis.set(`machines:${id}:status`, status, {"EX": EXPIRE_TIME});
    return res;
}

async function getTeams() {
    await connect();
    
    let res = null;
    if (await redis.get("teams:cached")) {
        res = await redis.hGetAll("teams");
        res = Object.keys(res).map((key) => ({ team_id: key, team_leader: res[key] }));
        console.log(" >> Got [teams] from cache");
    } else {
        const teams = await fms.collection("teams");
        res = await teams.find({}).toArray();
        for (let team of res) {
            await redis.hSet("teams", team.team_id, team.team_leader);
        }
        await redis.set("teams:cached", "true", {"EX": EXPIRE_TIME});
    }

    for (let team of res) {
        team.nrec = await redis.get(`teams:${team.team_id}:nrec`);
    }
    
    return res;
}

async function getTeamRecs(id) {
    await connect();

    const teams = await fms.collection("teams");
    const res = await teams.aggregate([
        {$match: { team_id: parseInt(id) }},
        {$project: {
            record_id: "$fixed_records"
        }},
        {$unwind: "$record_id"},
        {$lookup: {
            from: "machines",
            localField: "record_id",
            foreignField: "anomaly_records.record_id",
            as: "machine"
        }},
        {$unwind: "$machine"},
        {$unwind: "$machine.anomaly_records"},
        {$match: { "machine.anomaly_records.fixed_by_team": parseInt(id) }},
        {$project: {
            record_id: 1,
            time: "$machine.anomaly_records.time",
            reason: "$machine.anomaly_records.reason",
            machine_id: "$machine.machine_id"
        }}
    ]).toArray();

    let nrec = res.length;
    await redis.set(`teams:${id}:nrec`, nrec, {"EX": EXPIRE_TIME});
    return res;
}

async function getTeamName(id) {
    await connect();

    const teams = await fms.collection("teams");
    const res = await teams.find({ team_id: parseInt(id)}).project({ team_leader: 1 }).toArray();
    return res;
}

function getNewId(ids) {
    let newId = null;
    do {
        newId = Math.floor(Math.random() * 1000);
    } while (ids.includes(newId));
    return newId;
}

async function addRec(t_id, m_id, time, reason) {
    await connect();

    console.log(t_id, m_id, time, reason);
    const teams = await fms.collection("teams");
    const machs = await fms.collection("machines");

    const existedIds = await machs.distinct("anomaly_records.record_id");
    const newRecId = getNewId(existedIds);

    machs.findOneAndUpdate(
        { machine_id: parseInt(m_id) },
        { $push: { anomaly_records: {
            record_id: newRecId,
            time: time,
            reason: reason,
            machine_id: parseInt(m_id),
            fixed_by_team: parseInt(t_id),
        }}}
    );

    if (t_id != null) {
        teams.findOneAndUpdate(
            { team_id: parseInt(t_id) },
            { $push: { fixed_records: newRecId }}
        );
    }

    await redis.del(`machines:${m_id}:status`);

    return [{ record_id: newRecId }];
}

async function removeRecs(id) {
    await connect();

    const machs = await fms.collection("machines");
    const teams = await fms.collection("teams");

    machs.updateMany(
        { "anomaly_records.record_id": parseInt(id) },
        { $pull: { anomaly_records: { record_id: parseInt(id) } }}
    );

    teams.updateMany(
        { "fixed_records.record_id": parseInt(id) },
        { $pull: { fixed_records: { record_id: parseInt(id) } }}
    );

    await redis.del(`machines:${id}:status`);
}

async function addAss(cond, m_id) {
    await connect();

    const machs = await fms.collection("machines");

    const condIds = await machs.aggregate([
        {$unwind: "$conditions"},
        {$match: { "conditions.cond_expr": cond }},
        {$project: {cond_id: "$conditions.cond_id"}},
    ]).toArray();

    let newCondId = null;
    if (condIds.length == 0) {
        newCondId = getNewId(await machs.distinct("conditions.cond_id"));
    } else {
        newCondId = condIds[0].cond_id;
    }

    machs.findOneAndUpdate(
        { machine_id: parseInt(m_id) },
        { $push: { conditions: {
            cond_id: newCondId,
            cond_expr: cond,
            machine_id: parseInt(m_id)
        }}}
    );

    return [{ cond_id: newCondId }];
}

async function removeAss(m_id, c_id) {
    await connect();

    const machs = await fms.collection("machines");

    machs.updateOne(
        { machine_id: parseInt(m_id) },
        { $pull: { conditions: { cond_id: parseInt(c_id) } }}
    );
}


exports.getMachines = getMachines;
exports.getFactories = getFactories;
exports.getProdLines = getProdLines;
exports.getAssertions = getAssertions;
exports.getRecords = getRecords;
exports.getTeams = getTeams;
exports.getTeamRecs = getTeamRecs;
exports.removeRecs = removeRecs;
exports.addRec = addRec;
exports.getTeamName = getTeamName;
exports.removeAss = removeAss;
exports.addAss = addAss;