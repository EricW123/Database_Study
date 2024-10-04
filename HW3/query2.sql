INSERT INTO MusicVideo Values(1, 1, "Alex");
INSERT INTO MusicVideo Values(2, 2, "B");
INSERT INTO MusicVideo Values(3, 3, "C");
INSERT INTO MusicVideo Values(4, 4, "D");
INSERT INTO MusicVideo Values(5, 5, "E");
INSERT INTO MusicVideo(video_id, video_director) Values(6, "A");
INSERT INTO MusicVideo(video_id, video_director) Values(7, "B");
INSERT INTO MusicVideo(video_id, video_director) Values(8, "C");
INSERT INTO MusicVideo(video_id, video_director) Values(9, "D");
INSERT INTO MusicVideo(video_id, video_director) Values(10, "E");

-- Following query will cause exception, showing that track_id needs to be unique, so a track cannot be more than one videoes at same time.
-- INSERT INTO MusicVideo(11, 1, "X");
