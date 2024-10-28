const express = require("express");
const router = express.Router();

const queries = require("../db/queries.js");


// main entry
router.get("/", (req, res) => {
    res.render("index");
});


async function try_catch(func) {
    try {
        func();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}

router.get("/get-factories", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getFactories());
    });
});

router.get("/get-pls", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getProdLines(req.query.fact_id));
    });
});

router.get("/get-machs", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getMachines(req.query.pl_id));
    });
});

router.get("/get-ass", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getAssertions(req.query.m_id));
    });
});

router.get("/get-rec", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getRecords(req.query.m_id));
    });
});

router.get("/get-teams", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getTeams());
    });
});

router.get("/get-trec", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.getTeamRecs(req.query.t_id));
    });
});

router.get("/rm-rec", async (req, res) => {
    try_catch(async () => {
        await queries.removeRecs(req.query.r_id);
        res.json([]);
    });
});

router.get("/add-rec", async (req, res) => {
    try_catch(async () => {
        res.json([await queries.addRec(
            req.query.t_id, req.query.m_id,
            `"${req.query.t}"`, `"${req.query.r}"`
        ),
        await queries.getTeamName(req.query.t_id)]);
    });
});

router.get("/rm-ass", async (req, res) => {
    try_catch(async () => {
        await queries.removeAss(req.query.m_id, req.query.c_id);
        res.json([]);
    });
});

router.get("/add-ass", async (req, res) => {
    try_catch(async () => {
        res.json(await queries.addAss(req.query.cond, req.query.m_id));
    })
})


module.exports = router;

