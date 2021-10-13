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
  -- OR set this as a FOREIGN KEY
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
  messages TEXT -- does it need NOT NULL ?? cause people can decide not to do this
);
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_photo_url VARCHAR(255) NOT NULL,
  cover_photo_url VARCHAR(255) NOT NULL,
  cost_per_night INTEGER NOT NULL,
  parking_spaces INTEGER,
  number_of_bathrooms INTEGER NOT NULL,
  number_of_bedrooms INTEGER NOT NULL,
  country VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  post_date VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT 0
);