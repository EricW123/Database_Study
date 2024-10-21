CREATE TABLE "Factory" (
	"factory_id"	INTEGER NOT NULL,
	"factory_name"	TEXT NOT NULL,
	PRIMARY KEY("factory_id")
);

CREATE TABLE "ProductionLine" (
	"pl_id"	INTEGER NOT NULL,
	"factory_id"	TEXT NOT NULL,
	PRIMARY KEY("pl_id"),
	FOREIGN KEY("factory_id") REFERENCES "Factory"("factory_id")
);

CREATE TABLE "Machine" (
	"machine_id"	INTEGER NOT NULL,
	"pl_id"	INTEGER NOT NULL,
	PRIMARY KEY("machine_id"),
	FOREIGN KEY("pl_id") REFERENCES "ProductionLine"("pl_id")
);

CREATE TABLE "Assertion" (
	"machine_id"	INTEGER NOT NULL,
	"cond_id"	TEXT NOT NULL,
	PRIMARY KEY("cond_id","machine_id"),
	FOREIGN KEY("cond_id") REFERENCES "Condition"("cond_id"),
	FOREIGN KEY("machine_id") REFERENCES "Machine"("machine_id")
);

CREATE TABLE "Condition" (
	"cond_id"	INTEGER NOT NULL,
	"cond_expr"	TEXT NOT NULL,
	PRIMARY KEY("cond_id")
);

CREATE TABLE "AnomalyRecord" (
	"record_id"	INTEGER NOT NULL,
	"machine_id"	INTEGER NOT NULL,
	"time"	INTEGER NOT NULL,
	"reason"	TEXT NOT NULL,
	"fixed_team_id"	INTEGER,
	PRIMARY KEY("record_id"),
	FOREIGN KEY("fixed_team_id") REFERENCES "MaintenanceTeam"("team_id"),
	FOREIGN KEY("machine_id") REFERENCES "Machine"("machine_id")
);

CREATE TABLE "MaintenanceTeam" (
	"team_id"	INTEGER NOT NULL,
	"fixed_anomalies"	INTEGER,
	PRIMARY KEY("team_id"),
	FOREIGN KEY("fixed_anomalies") REFERENCES "AnomalyRecord"("record_id")
);