const {Client} = require("pg");
require('dotenv').config();

const SQL = `
CREATE TABLE contours (
    id SERIAL PRIMARY KEY,
    x1 FLOAT,
    y1 FLOAT,
    x2 FLOAT,
    y2 FLOAT,
    x3 FLOAT,
    y3 FLOAT,
    x4 FLOAT,
    y4 FLOAT
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    contour_id INTEGER,
    img TEXT,
    FOREIGN KEY (contour_id) REFERENCES contours(id)
);

CREATE TABLE scores (
    user_name VARCHAR(50) UNIQUE NOT NULL,
    time INTEGER 
);

INSERT INTO contours (x1, y1, x2, y2, x3, y3, x4, y4)
VALUES 
    (0.10093896713615023, 0.38576244072444726, 0.10093896713615023, 0.3455407644403817, 
     0.11150234741784038, 0.3455407644403817, 0.11150234741784038, 0.38576244072444726), -- Odlaw's rectangle
    (0.6118959107806692, 0.3671172393825887, 0.6118959107806692, 0.4111249841666214, 
     0.6245353159851301, 0.3671172393825887, 0.6245353159851301, 0.4111249841666214), -- Wally's rectangle
    (0.26245353159851303, 0.3868049146807086, 0.26245353159851303, 0.34163907134972765, 
     0.275092936802974, 0.34163907134972765, 0.275092936802974, 0.3868049146807086); -- Wizard's rectangle

INSERT INTO characters (name, contour_id, img)
VALUES 
    ('Odlaw', 1, 'odlaw'), -- Links to the first rectangle
    ('Wally', 2, 'wally'), -- Links to the second rectangle
    ('Wizard', 3, 'wizard'); -- Links to the third rectangle


`;

async function main(){
    console.log('seeding...');
    const client = new Client({
        connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();