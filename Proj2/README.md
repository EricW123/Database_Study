# Proj2: Design & Implement a Document Database

This project doesn't depend on any external database, the database tables and values can be created by sqlite code as below.

## How to run

1. Either create a docker container or run mongosh locally, so you can access the mongodb on port 27017.
2. In this folder (Proj2), run `python generate_data.py` with any version of Python. The code should fit almost any version of Python.
  * The code above will generate three json files, called `fac.json`, `mach.json` and `team.json` respectively.
3. Insert generated data into database
  * Open mongoDB Compass, connect to localhost with port 27017, then create a new database in the left panel with name `fms`.
  * In mongoDB Compass, inside the `fms` database, create three collections with name `factories`, `machines`, `teams` respectively.
  * Click the `factories` collection, then click the green `ADD DATA` button and choose `Insert document`. Copy all letters inside the `fac.json` into the new sub-window, replacing all example lines it provides. Click `Insert` button and then the data should be inserted.
  * Do Step6 two more times, inserting `mach.json` into `machines` collection and inserting `team.json` into `teams` collection.
4. In this folder (Proj2), run `npm install` to init and install required libraries. Then run `node queries.js` and queri results should be printed to terminal.

## Tasks

1. Provide the problem requirements and the conceptual model in UML for your project. You can reuse the ones made in Project 1.
2. Adapt the Logical Data model from your Project 2 to have hierarchical tables. This is, main (root) tables from which all the other tables relate to. This main tables will become later your Mongo Collections. From your main tables you can have aggregation/composition, one to many and many to many relationships.
3. From this logical model define the main Collections (Documents/Tables) you will be using in your Mongo Database. Provide a couple of JSON examples of these objects with comments when necessary. Think about a document that you will give to another database engineer that would take over your database.
> Answers of Task 1-3 can be found in [Problem.docx](./Problem.docx)
4. Populate the tables with test data. You can use tools such as https://www.mockaroo.com/schemasLinks to an external site. or  https://www.generatedata.com/Links to an external site.. You can export the sample data to JSON and then use mongoimport or Mongo Compass to populate your tables. Include in your repository a dump file that can be use to regenerate your database, and the instructions on how to initialize it.
> Achieved with (generate\_data.py)[./generate\_data.py], instructions already mentioned in `How to run` section.
5. Define and execute at least five queries that show your database. At least one query must use the aggregation framework https://docs.mongodb.com/manual/aggregation/Links to an external site., one must contain a complex search criterion (more than one expression with logical connectors like $or), one should be counting documents for an specific user, and one must be updating a document based on a query parameter.
> [queries.js](./queries.js) contains all 5 queries and outputs them to terminal.

