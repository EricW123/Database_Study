INSERT INTO Factory (factory_id, factory_name)
VALUES
	(1, "Austin"),
	(2, "Beck"),
	(3, "Conan"),
	(4, "Dana"),
	(5, "Elix");


INSERT INTO ProductionLine (pl_id, factory_id)
VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 2),
	(7, 2),
	(8, 2),
	(9, 2),
	(10, 2),
	(11, 3),
	(12, 3),
	(13, 3),
	(14, 3),
	(15, 3),
	(16, 4),
	(17, 4),
	(18, 4),
	(19, 4),
	(20, 4);


INSERT INTO Machine (machine_id, pl_id)
VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 2),
	(7, 2),
	(8, 2),
	(9, 2),
	(10, 2),
	(11, 3),
	(12, 3),
	(13, 3),
	(14, 3),
	(15, 3),
	(16, 4),
	(17, 4),
	(18, 4),
	(19, 4),
	(20, 4);


INSERT INTO Condition (cond_id, cond_expr)
VALUES
	(1, "Voltage > 95"),
	(2, "Current < 3"),
	(3, "Current > 0.5"),
	(4, "Output rate > 3");


INSERT INTO Assertion (machine_id, cond_id)
VALUES
    (1, 1),
    (1, 4),
    (2, 1),
    (2, 2),
    (2, 3),
    (3, 2),
    (3, 3),
    (4, 2),
    (4, 3),
    (4, 4),
    (5, 2),
    (5, 3),
    (5, 4),
    (6, 3),
    (6, 4),
    (7, 1),
    (7, 4),
    (8, 2),
    (8, 3),
    (9, 1),
    (9, 2),
    (10, 2),
    (11, 1),
    (12, 1),
    (12, 3),
    (13, 1),
    (13, 3),
    (13, 4),
    (14, 1),
    (14, 2),
    (14, 3),
    (14, 4),
    (15, 2),
    (15, 4),
    (16, 1),
    (16, 2),
    (16, 3),
    (16, 4),
    (17, 1),
    (17, 2),
    (17, 3),
    (17, 4),
    (19, 4),
    (20, 1),
    (20, 3);


INSERT INTO MaintenanceTeam (team_leader)
VALUES
	("Jack"),
	("Peter"),
	("Steve");


INSERT INTO AnomalyRecord (machine_id, "time", reason, fixed_team_id)
VALUES
	(1, "Sep17/2024", "Conductor broke", 1),
	(2, "Sep19/2024", "Motor broke", 3),
	(3, "Oct7/2024", "Arm wear", 1),
	(3, "Oct15/2024", "Battery out of age", 1),
    (7, "Oct20/2024", "Placeholder", 2),
    (8, "Oct21/2024", "Placeholder", NULL),
    (9, "Oct22/2024", "Placeholder", 2),
    (10, "Oct23/2024", "Placeholder", 1),
    (11, "Oct24/2024", "Placeholder", 1),
    (12, "Oct25/2024", "Placeholder", 3),
    (13, "Oct26/2024", "Placeholder", 3),
    (14, "Oct27/2024", "Placeholder", 2),
    (15, "Oct28/2024", "Placeholder", 3),
    (16, "Oct29/2024", "Placeholder", NULL),
    (17, "Oct30/2024", "Placeholder", NULL),
    (18, "Oct31/2024", "Placeholder", NULL),
    (19, "Nov1/2024", "Placeholder", 3),
    (20, "Nov2/2024", "Placeholder", 3);
