BEGIN;

DROP TABLE IF EXISTS users, list CASCADE;

DROP TABLE IF EXISTS list CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  hashedPassword VARCHAR(100) NOT NULL,
  is_admin BOOLEAN DEFAULT false
);

-- under bcrypt.hash(pw, 10):
-- 12345-> $2a$10$jjczKwDy/RYmdFTI.KUY0e.QToOk.fHQcBpOLpF8t8Ulg6dvy5TaW
-- 6789 -> $2a$10$BEGjB7mWtWc3dEC9i39UquiazSdXXhd1nGwkpYPlPQJjcQ21/4iIC
-- 10101-> $2a$10$/tjywfbpaLnYEqBjXRHHD.KtgLb5O9GN5kp1cmG/jUY5EHLmkHq5e


INSERT INTO users (username, hashedPassword, is_admin) VALUES
  ('Tom', '$2a$10$jjczKwDy/RYmdFTI.KUY0e.QToOk.fHQcBpOLpF8t8Ulg6dvy5TaW', false),
  ('James', '$2a$10$BEGjB7mWtWc3dEC9i39UquiazSdXXhd1nGwkpYPlPQJjcQ21/4iIC', true),
  ('Amelie', '$2a$10$/tjywfbpaLnYEqBjXRHHD.KtgLb5O9GN5kp1cmG/jUY5EHLmkHq5e', false);

CREATE TABLE list (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users (id),
  content TEXT NOT NULL,
  marked_by INTEGER REFERENCES users (id)
);

INSERT INTO list (owner_id, content, marked_by) VALUES (1, 'get milk', 2), (2, 'buy flowers', 2), (1, 'buy cookies', null);


COMMIT;
