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
	option_title varchar(40), 
	video_url varchar(250),
	dato varchar(12),
	scorer varchar(90),
	scorerlag varchar(60),
	motstander varchar(60),
	thumbnail_url varchar(250),
	
   	CONSTRAINT fk_option
		FOREIGN KEY(poll_id) 
	  		REFERENCES TBL_POLL(id)
);


INSERT INTO TBL_POLL (Client_id, poll_title, poll_description, sluttdato)
VALUES (45, 'Goal of the season', 'Which one of these three goals is the best of the season', '01-06-2022');

INSERT INTO TBL_POLL (Client_id, poll_title, poll_description, sluttdato)
VALUES (30, 'Goal of the week', 'Which one of these eight goals is the best of this week', '21-05-2022');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (2, 'Mikel Obi v LSK', 'vid url', '01-02-2022', 'OBI', 'RBK', 'LSK', 'thumbnail_url');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (1, 'Marcus Abrahamsen v Odd', 'vid url', '01-03-2022', 'Abrahamsen', 'B/G', 'ODD', 'thumbnail_url');

INSERT INTO TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url)
VALUES (1, 'Marcus Abrahamsen v Vif', 'vid url', '01-02-2022', 'Abrahamsen', 'B/G', 'VIF', 'thumbnail_url');
