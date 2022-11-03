require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection, client } = require('./db/dbConnection');
const pokemonRouter = require('./routes/pokemon.router');
const pokemonSpeciesRouter = require('./routes/pokemon-species.router');
const pokemonChainRouter = require('./routes/pokemon-chain.router');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.router');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/pokemon', pokemonRouter);
app.use('/api/pokemon-species', pokemonSpeciesRouter);
app.use('/api/pokemon-chain', pokemonChainRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(process.env.PORT, async () => {
    try {        
        await dbConnection();

        console.log(`Server is running on port ${process.env.PORT}`)
    } catch(err) {
        console.log(err);
    }
});