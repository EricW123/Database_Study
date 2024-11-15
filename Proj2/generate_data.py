import random
import json

machine_ids = []
team_ids = []
records = []

rni = random.randint
rci = random.choice

gname = lambda x: "".join(chr(rni(97,120)) for _ in range(x))

machines = []

factories = []
for _ in range(3):
    factory = dict()
    factory["factory_id"] = gname(rni(5,10))
    factory["factory_name"] = factory["factory_id"][:5] + " " + "".join(str(rni(0, 50)) for _ in range(3))
    factory["prodlines"] = []
    factories.append(factory)

for i in range(rni(4, 10)):
    prodline = dict()
    prodline["prodline_id"] = rni(0, 100) + i*100
    prodline["machines"] = []
    rci(factories)["prodlines"].append(prodline)

for i in range(rni(5, 20)):
    machine = dict()
    machine["machine_id"] = rni(0, 100) + i*100
    machine_ids.append(machine["machine_id"])

    fac = rci(factories)
    while len(fac["prodlines"]) == 0:
        fac = rci(factories)
    pl = rci(fac["prodlines"])
    pl["machines"].append(machine)
    
    m = dict()
    m["machine_id"] = machine["machine_id"]
    m["factory_id"] = fac["factory_id"]
    m["prodline_id"] = pl["prodline_id"]
    m["anomaly_records"] = []
    m["conditions"] = []
    machines.append(m)

with open('fac.json', 'w+') as f:
    json.dump(factories, f, indent=4)


teams = []
for i in range(rni(3, 10)):
    team = dict()
    team["team_id"] = rni(1, 100) + i*40
    team_ids.append(team["team_id"])
    team["team_leader"] = gname(10)
    team["fixed_records"] = []
    teams.append(team)

for i in range(rni(5, 20)):
    rec = dict()
    rec["record_id"] = rni(0, 20) + (i+1)*30
    rec["time"] = f"202{rni(0,2)}-{rni(1,12)}-{rni(1,28)}"
    rec["reason"] = gname(rni(10, 20))
    if rni(0, 10) <= 1:
        rec["fixed_by_team"] = "null"
    else:
        team = rci(teams)
        rec["fixed_by_team"] = team["team_id"]
        team["fixed_records"].append(rec["record_id"])

    records.append(rec)

with open("team.json", "w+") as f:
    json.dump(teams, f, indent=4)

cond_ids = []
for m in machines:
    for _ in range(rni(0, 2)):
        if len(records) == 0:
            break
        r = rci(records)
        m["anomaly_records"].append(r)
        records.remove(r)
    for _ in range(rni(0, 3)):
        c = dict()
        c_id = rni(0, 100)
        while c_id in cond_ids:
            c_id = rni(0, 100)
        cond_ids.append(c_id)
        c["cond_id"] = c_id
        c["machine_id"] = m["machine_id"]
        c["cond_expr"] = "placeholder"
        m["conditions"].append(c)

with open("mach.json", "w+") as f:
    json.dump(machines, f, indent=4)

