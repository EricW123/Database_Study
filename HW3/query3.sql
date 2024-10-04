INSERT INTO MusicVideo(track_id, video_director) VALUES(
	(SELECT TrackId FROM tracks WHERE Name == "Voodoo"),
	"V"
);

