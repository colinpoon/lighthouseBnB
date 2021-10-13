CREATE DATABASE lightbnb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  start_date DATE,
  end_date DATE,
  property_id INTEGER NOT NULL REFERENCES users(id),
  -- property_id INTEGER NOT NULL REFERENCES properties(id), ** Multiple refrences?  
  guest_id INTEGER NOT NULL REFERENCES users(id)
  -- guest_id INTEGER NOT NULL REFERENCES reservation(id)
);

CREATE TABLE property_reviews (
id SERIAL PRIMARY KEY,
guest_id INTEGER NOT NULL REFERENCES users(id),
property_id INTEGER NOT NULL REFERENCES property(id),
reservation_id INTEGER NOT NULL REFERENCES reservations(id),
rating SMALLINT,
messages TEXT
-- does it need NOT NULL ?? cause people can decide not to do this
);