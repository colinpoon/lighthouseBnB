INSERT INTO users (name, email, password)
VALUES ('Taylor Made', 't@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Marc Jacob', 'm@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('John Elliot Made', 'j@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES (1, 1, 'Big White House', 'desc','shorturl.at/cpvK4', 'shorturl.at/cpvK4', 1000, 5, 12, 12, 'United States', '0000 street', 'Miami', 'Florida', '1c1c1c', true),
(2, 2, 'City Condo', 'desc', 'shorturl.at/btJW1', 'shorturl.at/btJW1', 550, 1, 2, 1, 'United States', '22nd street', 'New York City', 'New York', '1c1c1c', false),
(3, 3, 'Shack', 'desc', 'shorturl.at/cwzI7', 'shorturl.at/cwzI7', 50, 0, 0, 1, 'Costa Rica', '1st street','Jaco', 'Carara', '1c1c1c', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-09-12', '2021-09-17', 1, 1),
('2021-09-12', '2021-09-17', 2, 2),
('2021-09-12', '2021-09-17', 3, 3);

INSERT INTO property_reviews (rating, message, guest_id, property_id, reservation_id)
VALUES (10, 'msg', 1, 1, 1),
(5, 'msg', 2, 2, 2),
(1, 'msg', 3, 3, 3);
