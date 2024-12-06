# Proj3: Design & Implement a Key-Value In-Memory Database

This project doesn't depend on any external database, the database tables and values can be created by sqlite code as below.

## How to run

1. Either create a docker container or run mongosh locally, so you can access the mongodb on port 27017.
2. In this folder (Proj3), run `python generate_data.py` with any version of Python. The code should fit almost any version of Python.
  * The code above will generate three json files, called `fac.json`, `mach.json` and `team.json` respectively.
3. Insert generated data into database
  * Open mongoDB Compass, connect to localhost with port 27017, then create a new database in the left panel with name `fms`.
  * In mongoDB Compass, inside the `fms` database, create three collections with name `factories`, `machines`, `teams` respectively.
  * Click the `factories` collection, then click the green `ADD DATA` button and choose `Insert document`. Copy all letters inside the `fac.json` into the new sub-window, replacing all example lines it provides. Click `Insert` button and then the data should be inserted.
  * Do Step6 two more times, inserting `mach.json` into `machines` collection and inserting `team.json` into `teams` collection.
4. In this folder (Proj3), run `npm install` to init and install required libraries. Then run `node queries.js` and queri results should be printed to terminal.
5. Run `npm start` to start the server, then visit `http://localhost:3000` to see the web page.

## Tasks

1. Provide the problem requirements and the conceptual model in UML for your project. You can reuse the one made on previous projects, but describe the functionalities that you selected to be used as an in-memory key-value storage, (e.g. most viewed products, a shopping cart, current logged-in users, etc).
2. Describe the Redis data structures that you are going to use to implement the functionalities you described in the previous point. (example To implement the most viewed products I will use a Redis sorted set with key "mostViewed:userId", product ids as the values and a score of the number of views of the product.). You can use/describe more than one data structure, you will need to implement at least one.
3. The redis commands that you would use to interact with your specific Redis structures.
> Task 1 to 3 can be found in the file [Problem.docx](./Problem.docx), which is a Word document.
4. Create a basic Node + Express application that let's you create, display, modify and delete at least one Redis data structure from the ones describe in the previous point. No need to have a polished interface, and you can use the code created in class as a starting point, and/or the code you created for previous projects.
> Check "How to run" section above for how to run the code.
5. Optional, didn't do.
6. Create a demonstration video showing the functionalities of your application.
> video directly uploaded to Canvas, won't be uploaded to Github.
