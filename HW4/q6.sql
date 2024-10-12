SELECT artists.Name FROM artists
JOIN albums ON artists.ArtistId = albums.ArtistId
JOIN tracks ON albums.AlbumId = tracks.AlbumId
JOIN media_types ON tracks.MediaTypeId = media_types.MediaTypeId
JOIN playlist_track ON tracks.TrackId = playlist_track.TrackId
JOIN playlists ON playlist_track.PlaylistId = playlists.PlaylistId
WHERE(
	(media_types.Name == "MPEG audio file" OR media_types.Name == "Protected MPEG-4 video file") AND
	(playlists.Name == "Brazilian Music" OR playlists.Name == "Grunge")
)
GROUP BY artists.Name;

