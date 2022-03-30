DROP TABLE IF EXISTS TBL_VOTE; 
DROP TABLE IF EXISTS TBL_OPTION; 
DROP TABLE IF EXISTS TBL_POLL;




CREATE TABLE TBL_POLL (
 	id SERIAL PRIMARY KEY,
 	client_id int NOT NULL,
	poll_title varchar(40) NOT NULL,
	poll_description varchar(600),
	sluttdato varchar(12)
);

CREATE TABLE TBL_OPTION (
	id SERIAL PRIMARY KEY,
	poll_id INT,
	option_title varchar(100), 
	video_url varchar(250),
	dato varchar(25),
	scorer varchar(100),
	scorerlag varchar(10),
	motstander varchar(100),
	thumbnail_url varchar(250),
	
   	CONSTRAINT fk_option
		FOREIGN KEY(poll_id) 
	  		REFERENCES TBL_POLL(id)
);


CREATE TABLE TBL_VOTE ( 
	id SERIAL PRIMARY KEY,
	option_id INT,
	email VARCHAR(60), 

	
	CONSTRAINT vote_option 
		FOREIGN KEY (option_id) 
			REFERENCES TBL_OPTION(id)
);


INSERT INTO TBL_POLL (Client_id, poll_title, poll_description, sluttdato)
VALUES (45, 'Goal of the season', 'Which one of these three goals is the best of the season', '01-12-2022');

INSERT INTO TBL_POLL (Client_id, poll_title, poll_description, sluttdato)
VALUES (30, 'Goal of the week', 'Which one of these eight goals is the best of this week', '21-12-2022');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (2, 'Mål Odd! Scoring av Tobias Lauritsen.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2962:6778000:6813000/Manifest.m3u8', '2021-12-12', 'Tobias Lauritsen', 'Odd', 'Stabæk', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2962/06788.jpg');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (2, 'Mål Odd! Scoring av Espen Ruud.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2962:6340000:6375000/Manifest.m3u8', '2021-12-12', 'Espen Ruud', 'Odd', 'Stabæk', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2962/06350.jpg');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (2, 'Mål Stabæk! Scoring av Fredrik Haugen.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2962:5767000:5802000/Manifest.m3u8', '2021-12-12', 'Fredrik Haugen', 'Stabæk', 'Odd', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2962/05777.jpg');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (1, 'Mål Haugesund! Scoring av Alexander Toft Søderlund.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2966:5399000:5434000/Manifest.m3u8', '2021-12-12', 'Alexander Toft Søderlund', 'Haugesund', 'Molde', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2966/05409.jpg');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (1, 'Mål Molde! Scoring av Ola Brynhildsen.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2966:5001000:5036000/Manifest.m3u8', '2021-12-12', 'Ola Brynhildsen', 'Molde', 'Molde', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2966/05011.jpg');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (1, 'Mål Odd! Scoring av Tobias Lauritsen.', 'https://api.forzasys.com/eliteserien/playlist.m3u8/2962:6778000:6813000/Manifest.m3u8', '2021-12-12', 'Tobias Lauritsen', 'Odd', 'Stabæk', 'https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2962/06788.jpg');

INSERT INTO TBL_VOTE (option_id, email) 
VALUES (1, 'olaNordmann@gmail.com');

INSERT INTO TBL_VOTE (option_id, email) 
VALUES (2, 'kariNordmann@hotmail.com');
