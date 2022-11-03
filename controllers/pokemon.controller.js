const { getDB } = require('../db/dbConnection');

const collectionPokemon = 'pokemons';
const collectionPokemonDetails = 'pokemon-details';

const list = async (req, res) => {
    // #swagger.tags = ['List pokemons']
    // #swagger.description = 'Endpoint to list pokemons.'

    try {
        const { page = 1, limit = 10 } = req.query;
        const pokemon = getDB().collection(collectionPokemon);

        const pokemonsDB = await pokemon.find({}, {
                projection: { _id: 0 }
            })
            .limit(limit)
            .skip((page - 1) * limit)
            .toArray();

        const totalDocs = await pokemon.countDocuments();

        res.json({
            ok: true,
            pokemons: pokemonsDB,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocs / limit)
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const getPokemon = async(req, res) => {
    // #swagger.tags = ['Get pokemon']
    // #swagger.description = 'Endpoint get a pokemon by id or name.'
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
        const pokemonDetails = getDB().collection(collectionPokemonDetails);

        const pokemonDB = await pokemonDetails.findOne({name}, {
            projection: { _id: 0 }
        });

        if(!pokemonDB) {
            return res.status(404).json({
                ok: false,
                message: 'Any pokemon was found with the specified name'
            });
        }

        res.json({
            ok: true,
            details: pokemonDB
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
        const pokemonDetails = getDB().collection(collectionPokemonDetails);

        const pokemonDB = await pokemonDetails.findOne({id}, {
            projection: { _id: 0 }
        });

        if(!pokemonDB) {
            return res.status(404).json({
                ok: false,
                message: 'Any pokemon was found with the specified id'
            });
        }

        res.json({
            ok: true,
            details: pokemonDB
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const create = async (req, res) => {
    // #swagger.tags = ['Create Pokemon']
    // #swagger.description = 'Endpoint to create a pokemon.'

    try {
        const { ...props } = req.body;
        const pokemon = getDB().collection(collectionPokemon);
        const pokemonDetails = getDB().collection(collectionPokemonDetails);

        const pokemonDBValidation = await pokemon.findOne({
            name: props.name
        });

        if(pokemonDBValidation) {
            return res.status(403).json({
                ok: false,
                message: 'The pokemon already exist'
            });
        }

        const pokemonDB = await pokemon.find()
            .sort({
                id: -1
            })
            .limit(1)
            .toArray();

        let nextId = pokemonDB?.[0]?.id ?? 0;

        props.id = ++nextId;
        
        await pokemon.insertOne({
            id: props.id,
            name: props.name
        });

        await pokemonDetails.insertOne(props);

        res.json({
            ok: true,
            message: 'Pokemon was created sucessfully'
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const update = async (req, res) => {
    // #swagger.tags = ['Update pokemon']
    // #swagger.description = 'Endpoint to update a pokemon.'

    try {
        const { idParam } = req.params;
        const { ...props } = req.body;
        const pokemon = getDB().collection(collectionPokemon);
        const pokemonDetails = getDB().collection(collectionPokemonDetails);
        const id = Number(idParam);
        
        if(Object.keys(props).length > 0){
            if('name' in props) {
                const pokemonDB = await pokemon.updateOne({id},{
                    $set: {
                        name: props.name
                    }
                });
    
                if(pokemonDB.matchedCount <= 0) {
                    return res.status(404).json({
                        ok: false,
                        message: 'Pokemon was not found'
                    });
                }
            }
            
            await pokemonDetails.updateOne({
                id: id
            },{
                $set: {
                    ...props
                }
            });
    
            return res.json({
                ok: true,
                message: 'Pokemon was updated successfully'
            });
        }

        res.json({
            ok: false,
            message: 'No paramaters were provided'
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const remove = async (req, res) => {
    // #swagger.tags = ['Delete pokemon']
    // #swagger.description = 'Endpoint to delete a pokemon.'

    try {
        const { idParam } = req.params;
        const pokemon = getDB().collection(collectionPokemon);
        const pokemonDetails = getDB().collection(collectionPokemonDetails);
        const id = Number(idParam);

        const pokemonDB = await pokemon.deleteOne({ id });

        if(pokemonDB.deletedCount <= 0) {
            return res.status(404).json({
                ok: false,
                message: 'Pokemon was not found'
            });
        }

        await pokemonDetails.deleteOne({ id });

        res.json({
            ok: true,
            message: 'Pokemon was deleted successfully'
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
    list,
    getPokemon,
    create,
    update,
    remove
}