# Proj1: Design & Implement a Relational Database

This project doesn't depend on any external database, the database tables and values can be created by sqlite code as below.

## How to run

Open DB Browser, create a new blank .db file, then execute the SQL code in [create\_tables](./create_tables.sql) to create new tables, execute [insert\_data](./insert_rows.sql) to generate example data, and lastly execute [queries](./queries.sql) to get query results. By there should be able to see correct and various query results that satisfies requirements of [part7](#p7).

## Parts of project requirement

* P1: Describe the requirements of the problem with a simple document that lists the rules of the database in the problem domain language. Then from that list of rules and notes highlight the list of possible nouns and actions you identified. I'm expecting this to be a short 1 or 2 pages document.
* P2: Analyze the problem and create a conceptual model in UML using a tool of your choice (e.g., LucidChart, Enterprise Architect, ArgoUML, Visual Paradigm, ERwin, TOAD) as discussed during class and provided in the references and resources below. Additional requirements and clarifications will be provided in the #general channel on Slack. The diagram must contain at least three classes, at least one to many relationship and one many to many. All relationships, except generalization, must have full multiplicity constraints and labeled as appropriate. Classes must have proper names, descriptions, and attributes with domain types. Try to avoid building a model with more than 10 entities.
* P3: From the Conceptual Model, construct a logical data model expressed as an ERD using a language of your choice (other than UML) and a tool of your choice. The logical data model may not have any many-to-many relationships, so introduce association entities as needed.
* P4: From the logical model, define a relational schema in at least BCNF. Using functional dependencies, show that the schema in in at least BCNF. I'm expecting 6-10 relations for one student or 12-20 relations for two students. If in doubt of how much work a student should do, please ask the professor.
> Works for P1~P4 can be found in [Problem.doc](./Problem.docx), where page 1 contains answer for P1, page 2 contains answers for P2~P4.
* P5: Create a set of SQL data definition statements for the above model and realize that schema in SQLite3 by executing the script from the SQLite3, the console or Node. You can use DB Browser to generate these statements. Show that the tables were created and conform to the constraints through screen shots or other means.
* P6: Populate the tables with test data. You can use tools such as https://www.mockaroo.com/schemasLinks to an external site. or  https://www.generatedata.com/Links to an external site..
* <a name="p7"></a>P7: Define and execute at least five queries that show your database. At least one query must contain a join of at least three tables, one must contain a subquery, one must be a group by with a having clause, and one must contain a complex search criterion (more than one expression with logical connectors). Experiment with advanced query mechanisms such as RCTE, PARTITION BY, or SELECT CASE/WHEN.
* P8: Create a basic Node + Express application that let's you create, display, modify and delete at least two of the tables with a foreign key between then. No need to have a polished interface, and you can use the code created in class as a starting point.
