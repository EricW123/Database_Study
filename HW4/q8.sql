SELECT
	playlists.PlaylistId,
	playlists.Name,
	ROUND(CAST(SUM(tracks.Milliseconds) AS FLOAT)/1000/60/60/2, 2) AS "len(hrs)"
FROM playlists
JOIN playlist_track ON playlists.PlaylistId = playlist_track.PlaylistId
JOIN tracks ON playlist_track.TrackId = tracks.TrackID
GROUP BY playlists.PlaylistId
HAVING "len(hrs)" >= 2;

