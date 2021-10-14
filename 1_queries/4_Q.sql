-- SELECT city as city, COUNT(reservations.)
-- FROM properties
-- JOIN reservations. ON properties.id = property_id
-- GROUP BY city
-- HAVING SUM()
-- ORDER BY total_reservations DESC;
SELECT properties.city, count(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;