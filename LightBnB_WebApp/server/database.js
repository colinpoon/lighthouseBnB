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

const getUserWithEmail = function(email) {
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
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
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
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
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
};
exports.addUser = addUser;


/// RESERVATIONS
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */


const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
    SELECT * FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    WHERE guest_id = $1
    LIMIT $2`, [guest_id, limit])
    .then((result) => {
      console.log('RESULT', result);
      console.log('RESULT.ROWS', result.rows);
      console.log('[0]', result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('ERROR:', err.message);
    });
};
exports.getAllReservations = getAllReservations;




/// PROPERTIES
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
///////////////////

//   id SERIAL PRIMARY KEY NOT NULL,
//   owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   thumbnail_photo_url VARCHAR(255) NOT NULL,
//   cover_photo_url VARCHAR(255) NOT NULL,
//   cost_per_night INTEGER  NOT NULL DEFAULT 0,
//   parking_spaces INTEGER  NOT NULL DEFAULT 0,
//   number_of_bathrooms INTEGER  NOT NULL DEFAULT 0,
//   number_of_bedrooms INTEGER  NOT NULL DEFAULT 0,
//   country VARCHAR(255) NOT NULL,
//   street VARCHAR(255) NOT NULL,
//   city VARCHAR(255) NOT NULL,
//   province VARCHAR(255) NOT NULL,
//   post_code VARCHAR(255) NOT NULL,

//   active BOOLEAN NOT NULL DEFAULT TRUE

///////////////////
const getAllProperties = function(options, limit = 10) {

  const queryParams = [];
  
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND properties.cost_per_night >= $${queryParams.length - 1} `;
    queryString += `AND properties.cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `AND properties.cost_per_night >= $${queryParams.length} `;
  }

  if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND properties.cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND property_reviews.rating >= $${queryParams.length} `;
  }

  if (queryParams.length === 0) {
    queryParams.push(10);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  } else {
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  }

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
  
}
exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function(property) {
  return pool

    .query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING*`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log('ERROR:', err.message);
    });
};
exports.addProperty = addProperty;