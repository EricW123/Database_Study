const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
let fms = null;

async function connect() {
    if (fms == null) {
        const client = new MongoClient(url);
        await client.connect();
        fms = client.db("fms");
        console.log("Connected to database fms");
    }
}

async function getFactories() {
    await connect();

    const facs = await fms.collection("factories");
    const res = await facs.aggregate([
        {$project: {
            factory_id: 1,
            factory_name: 1
        }},
    ]).toArray();
    return res;
}

async function getProdLines(id) {
    await connect();

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
    return res;
}

async function getMachines(id) {
    await connect();

    const facs = await fms.collection("factories");
    const res = await facs.aggregate([
        {$unwind: "$prodlines"},
        {$match: { "prodlines.prodline_id": parseInt(id) }},
        {$project: {
            factory_id: 1,
            pl_id: "$prodlines.prodline_id",
            machines: "$prodlines.machines"
        }},
        {$unwind: "$machines"},
        {$project: {
            factory_id: 1,
            pl_id: 1,
            machine_id: "$machines.machine_id",
        }}
    ]).toArray();
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
        {$unwind: "$fixed_team"},
        {$project: {
            record_id: 1,
            time: 1,
            reason: 1,
            team_leader: "$fixed_team.team_leader"
        }}
    ]).toArray();
    return res;
}

async function getTeams() {
    await connect();

    const teams = await fms.collection("teams");
    const res = await teams.find({}).toArray();
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