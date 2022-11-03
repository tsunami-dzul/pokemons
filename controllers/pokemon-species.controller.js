const { getDB } = require('../db/dbConnection');

const collectionName = 'pokemon-species';

const getPokemon = async (req, res) => {
    try {
        const { param } = req.params;

        isNaN(Number(param)) ? getByName(param, res) : getById(Number(param), res);
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const getByName = async (name, res) => {
    try {
        const pokemonSpecies = getDB().collection(collectionName);

        const pokemonSpeciesDB = await pokemonSpecies.findOne({name});

        if(!pokemonSpeciesDB) {
            return res.status(404).json({
                ok: false,
                message: 'Pokemon was not found'
            });
        }

        res.json({
            ok: true,
            pokemonSpecies: pokemonSpeciesDB
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const getById = async (id, res) => {
    try {
        const pokemonSpecies = getDB().collection(collectionName);

        const pokemonSpeciesDB = await pokemonSpecies.findOne({id});

        if(!pokemonSpeciesDB) {
            return res.status(404).json({
                ok: false,
                message: 'Pokemon was not found'
            });
        }

        res.json({
            ok: true,
            pokemonSpecies: pokemonSpeciesDB
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

module.exports = {
    getPokemon,
}