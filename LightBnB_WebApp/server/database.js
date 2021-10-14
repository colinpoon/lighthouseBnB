const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// USERS
/**
Get a single user from the database given their email.
@param {String} email The email of the user.
@return {Promise<{}>} A promise to the user. */

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows[0] && result.rows[0].id) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log('ERROR:', err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows[0] && result.rows[0].id) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log('ERROR:', err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(`
    INSERT INTO users (name, password, email)
    VALUES ($1, $2, $3)
    RETURNING*`, [user.name, user.password, user.email])
    .then((result) => {
      // console.log('NAME', user.name);
      // console.log('PASS', user.password);
      // console.log('EMAIL', user.email);
      // console.log('[0]',result.rows[0]);
      // console.log('[0].ID',result.rows[0].id);
      if (result.rows[0].id) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log('ERROR:', err.message);
    });
}
exports.addUser = addUser;




/// RESERVATIONS
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// PROPERTIES
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return Object.assign({}, result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  pool
    .query(`
  SELECT * 
  FROM properties 
  LIMIT`)
    .then((result) => { })
    .catch((err) => {
      console.log(err.message);
    })
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
