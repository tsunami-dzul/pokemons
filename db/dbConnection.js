const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DB_STR_CONN);
let db = null;

const dbConnection = async () => {
    try {
        await client.connect();

        db = client.db('pokemon');

        console.log('Connection to the database was successfull');
    } catch(e) {
        console.log(err);
    }
}

const getDB = () => db;

module.exports = {
    dbConnection,
    client,
    getDB,
};