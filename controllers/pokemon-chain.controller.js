const { getDB } = require('../db/dbConnection');

const collectionName = 'pokemon-evolution-chain';

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
        const pokemonChain = getDB().collection(collectionName);

        const pokemonChainDB = await pokemonChain.findOne({name});

        if(!pokemonChainDB) {
            return res.status(404).json({
                ok: false,
                message: 'Pokemon was not found'
            });
        }

        res.json({
            ok: true,
            pokemonChain: pokemonChainDB
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
        const pokemonChain = getDB().collection(collectionName);

        const pokemonChainDB = await pokemonChain.findOne({id});

        if(!pokemonChainDB) {
            return res.status(404).json({
                ok: false,
                message: 'Pokemon was not found'
            });
        }

        res.json({
            ok: true,
            pokemonChain: pokemonChainDB
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