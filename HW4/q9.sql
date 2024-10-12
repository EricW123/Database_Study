SELECT 
	artists.Name,
	SUM(tracks.UnitPrice * invoice_items.Quantity) AS "TotalPrice"
FROM artists
	JOIN albums ON artists.ArtistId = albums.ArtistId
	JOIN tracks ON albums.AlbumId = tracks.AlbumId
	JOIN invoice_items ON tracks.TrackId = invoice_items.TrackId
GROUP BY artists.ArtistId
ORDER BY "TotalPrice" DESC;

