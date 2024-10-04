# HW3: Practice SQL

This HW depends a database and implements 8 queries on it.

## How to run

Visit https://www.sqlitetutorial.net/sqlite-sample-database/, find section "Download SQLite sample database" and download the database.
Unzip the downloaded file, find the chinook.db file.

Open DB Browser, import the db file then click "execute SQL". Click "Open SQL File" and choose the sql file corresponding to each queries. Then run the code, and should be able to see changes or query results to the database.

## Queries

* Query 1: Create a new Table Music Video, that is a class of type Track (generalization) but adds the attribute Video director. A music video is a track. There cannot be a video without a track, and each track can have either no video or just one.

    [query1.sql](./query1.sql)
* Query 2: Write the queries that insert at least 10 videos, respecting the problem rules.
* Query 3:  Insert another video for the track "Voodoo", assuming that you don't know the TrackId, so your insert query should specify the TrackId directly.
* Query 4:  Write a query that lists all the tracks that have a ' in the name (e.g. Jorge Da Capadócia, o Samba De Uma Nota Só (One Note Samba)) (this is á,é,í,ó,ú)
* Query 5: Creative addition. Make an interesting query that uses a JOIN of at least two tables.
* Query 6: Creative addition. Make an interesting query that uses a GROUP statement and at least two tables.
* Query 7:  Write a query that lists all the customers that listen to longer-than-average tracks, excluding the tracks that are longer than 15 minutes. 
* Query 8:  Write a query that lists all the tracks that are not in one of the top 5 genres with longer duration in the database.
