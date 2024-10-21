SELECT Machine.machine_id, cond_expr FROM Machine
JOIN Assertion ON Machine.machine_id = Assertion.machine_id
JOIN Condition ON assertion.cond_id = Condition.cond_id
ORDER BY Machine.machine_id;


SELECT 
	MaintenanceTeam.team_leader AS "team leader",
	COUNT(DISTINCT AnomalyRecord.record_id) AS "num of fixed issues"
FROM AnomalyRecord
JOIN MaintenanceTeam ON AnomalyRecord.fixed_team_id = MaintenanceTeam.team_id
GROUP BY MaintenanceTeam.team_id;


SELECT
	Machine.machine_id AS "Broken machines",
	AnomalyRecord."time" AS "Broken time",
	AnomalyRecord.reason AS "Broken reason"
FROM Machine
LEFT JOIN AnomalyRecord ON Machine.machine_id = AnomalyRecord.machine_id
GROUP BY Machine.machine_id
HAVING AnomalyRecord.record_id IS NOT NULL AND AnomalyRecord.fixed_team_id IS NULL;


WITH BrokenMachines AS (SELECT
	Machine.machine_id
FROM Machine
LEFT JOIN AnomalyRecord ON Machine.machine_id = AnomalyRecord.machine_id
GROUP BY Machine.machine_id
HAVING AnomalyRecord.record_id IS NOT NULL AND AnomalyRecord.fixed_team_id IS NULL)
SELECT DISTINCT Factory.factory_name FROM Factory
JOIN ProductionLine ON Factory.factory_id = ProductionLine.factory_id
WHERE ProductionLine.pl_id IN (
	SELECT DISTINCT ProductionLine.pl_id FROM ProductionLine
	JOIN Machine ON ProductionLine.pl_id = Machine.pl_id
	WHERE Machine.machine_id IN (BrokenMachines)
);


WITH
AllMachines AS (
SELECT Machine.machine_id FROM MaintenanceTeam
JOIN AnomalyRecord ON MaintenanceTeam.team_id = AnomalyRecord.fixed_team_id
JOIN Machine ON AnomalyRecord.machine_id = Machine.machine_id),
BrokenMachines AS (
SELECT Machine.machine_id FROM Machine
LEFT JOIN AnomalyRecord ON Machine.machine_id = AnomalyRecord.machine_id
GROUP BY Machine.machine_id
HAVING AnomalyRecord.record_id IS NOT NULL AND AnomalyRecord.fixed_team_id IS NULL)
SELECT
	Machine.pl_id AS "production line no.",
	Machine.machine_id AS "machine no."
FROM Machine WHERE (Machine.machine_id in (AllMachines) AND Machine.machine_id NOT IN (BrokenMachines));

