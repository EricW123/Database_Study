SELECT
	playlists.PlaylistId,
	playlists.Name,
	SUM(tracks.Milliseconds)/1000/60/60/2 AS "len(hrs)"
FROM playlists
JOIN playlist_track ON playlists.PlaylistId = playlist_track.PlaylistId
JOIN tracks ON playlist_track.TrackId = tracks.TrackID
GROUP BY playlists.PlaylistId
HAVING (
	SUM(tracks.Milliseconds) >= 2*60*60*1000
);


