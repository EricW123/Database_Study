SELECT (*) FROM (
	SELECT
		artists.ArtistId,
		artists.Name,
		SUM(CASE WHEN media_types.Name LIKE "%MPEG%" THEN 1 ELSE 0 END) AS "num of MPEG"
	FROM artists
	JOIN albums ON artists.ArtistId = albums.ArtistId
	JOIN tracks ON albums.AlbumId = tracks.AlbumId
	JOIN media_types ON tracks.MediaTypeId = media_types.MediaTypeId
	GROUP BY artists.ArtistId
	HAVING "num of mpeg" >= 10
);



