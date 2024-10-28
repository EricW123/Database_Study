const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite")

let db = null;

async function connect() {
    if (db == null)
        db = await open({
        filename: "./db/main.db",
        driver: sqlite3.Database,
    });
}


async function getFactories() {
    await connect();

    const queries = "SELECT * FROM Factory";
    let res = await db.all(queries);
    return res;
}

async function getProdLines(id) {
    await connect();

    const queries = `SELECT * FROM ProductionLine WHERE factory_id = ${id}`;
    let res = await db.all(queries);
    return res;
}

async function getMachines(id) {
    await connect();

    const queries = `SELECT * FROM Machine WHERE pl_id = ${id}`;
    let res = await db.all(queries);
    return res;
}

async function getAssertions(id) {
    await connect();

    const queries = `SELECT
        Condition.cond_id,
        Condition.cond_expr
    FROM Assertion
    LEFT JOIN Condition ON Assertion.cond_id = Condition.cond_id
    WHERE Assertion.machine_id = ${id}`;
    let res = await db.all(queries);
    return res;
}

async function getRecords(id) {
    await connect();

    const queries = `SELECT
        AnomalyRecord.record_id,
        AnomalyRecord.time,
        AnomalyRecord.reason,
        MaintenanceTeam.team_leader
    FROM AnomalyRecord LEFT JOIN MaintenanceTeam
    ON AnomalyRecord.fixed_team_id = MaintenanceTeam.team_id
    WHERE AnomalyRecord.machine_id = ${id};
    `;
    let res = await db.all(queries);
    return res;
}

async function getTeams() {
    await connect();

    const queries = `SELECT * FROM MaintenanceTeam`
    let res = await db.all(queries);
    return res;
}

async function getTeamRecs(id) {
    await connect();

    const queries = `SELECT
        AnomalyRecord.record_id,
        AnomalyRecord.time,
        AnomalyRecord.reason,
        AnomalyRecord.machine_id
    FROM AnomalyRecord
    WHERE AnomalyRecord.fixed_team_id = ${id}
    `;
    let res = await db.all(queries);
    return res;
}

async function removeRecs(id) {
    await connect();

    const queries = `DELETE FROM AnomalyRecord
        WHERE (AnomalyRecord.record_id = ${id})`;
    await db.all(queries);
}

async function addRec(t_id, m_id, time, reason) {
    await connect();

    const queries = `INSERT INTO AnomalyRecord (
            fixed_team_id,
            machine_id,
            time,
            reason
        )
        VALUES (
            ${t_id}, ${m_id}, ${time}, ${reason}
        )
        RETURNING record_id;`;
    let res = await db.all(queries);
    return res;
};

async function getTeamName(id) {
    await connect();

    const queries = `SELECT team_leader FROM MaintenanceTeam
        WHERE team_id = ${id}`;
    let res = await db.all(queries);
    return res;
}

async function removeAss(m_id, c_id) {
    await connect();

    const queries = `DELETE FROM Assertion
    WHERE machine_id = ${m_id} AND cond_id = ${c_id}`;
    let res = await db.all(queries);
    return res;
}

async function addAss(cond, m_id) {
    await connect();

    await db.exec('BEGIN TRANSACTION');
    await db.run(`
    INSERT INTO Condition (cond_expr)
    SELECT "${cond}"
    WHERE NOT EXISTS (SELECT 1 FROM Condition WHERE cond_expr = "${cond}")`);
    
    const result = await db.get(`
    SELECT cond_id FROM Condition where cond_expr = "${cond}"`);

    await db.run(`
    INSERT INTO Assertion VALUES (${m_id}, ${result['cond_id']})`);

    await db.exec('COMMIT');
    return result;
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

