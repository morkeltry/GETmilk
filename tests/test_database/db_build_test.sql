BEGIN;

DROP TABLE IF EXISTS users, list CASCADE;

DROP TABLE IF EXISTS list CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  hashed_password VARCHAR(100) NOT NULL,
  is_admin BOOLEAN DEFAULT false
);

INSERT INTO users (username, hashed_password, is_admin) VALUES ('Tom', 12345, false), ('James', 6789, true), ('Amelie', 10101, false);

CREATE TABLE list (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users (id),
  content TEXT NOT NULL,
  marked_by INTEGER REFERENCES users (id)
);

INSERT INTO list (owner_id, content, marked_by) VALUES (1, 'get milk', 2), (2, 'buy flowers', 2), (1, 'buy cookies', null);


COMMIT;
