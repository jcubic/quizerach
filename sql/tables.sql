CREATE TABLE IF NOT EXISTS user(
user_id INTEGER PRIMARY KEY autoincrement,
email VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS user_pool(
user_pool_id INTEGER PRIMARY KEY autoincrement,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS Poll (
poll_id INTEGER PRIMARY KEY autoincrement,
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Question (
question_id INTEGER PRIMARY KEY autoincrement,
poll_id INTEGER NOT NULL,
intro_text TEXT NOT NULL,
outro_text TEXT NOT NULL,
FOREIGN KEY (poll_id) REFERENCES Poll(poll_id)
);

CREATE TABLE IF NOT EXISTS Option (
option_id INTEGER PRIMARY KEY autoincrement,
question_id INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES Question(question_id)
);

CREATE TABLE IF NOT EXISTS Answer (
answer_id INTEGER PRIMARY KEY autoincrement,
user_id INTEGER NOT NULL,
question_id INTEGER NOT NULL,
answer TEXT,
option_id INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES Question(question_id),
FOREIGN KEY (user_id) REFERENCES user(user_id),
FOREIGN KEY (option_id) REFERENCES Option(option_id)
);
