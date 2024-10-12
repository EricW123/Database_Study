SELECT artists.ArtistId, artists.Name FROM
artists JOIN albums ON artists.ArtistId = albums.ArtistId
WHERE (albums.Title LIKE "%symphony%");

