CREATE TABLE "MusicVideo" (
	"video_id"	INTEGER NOT NULL,
	"track_id"	INTEGER UNIQUE,
	"video_director"	TEXT NOT NULL,
	PRIMARY KEY("video_id")
);
