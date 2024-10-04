CREATE TABLE "MusicVideo" (
	"video_id"	INTEGER NOT NULL,
	"track_id"	INTEGER UNIQUE,
	"video_director"	TEXT,
	PRIMARY KEY("video_id"),
	FOREIGN KEY("track_id") REFERENCES "tracks"("TrackId")
);

