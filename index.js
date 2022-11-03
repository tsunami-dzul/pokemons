require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const { dbConnection, client } = require('./db/dbConnection');
const pokemonRouter = require('./routes/pokemon.router');
const pokemonSpeciesRouter = require('./routes/pokemon-species.router');
const pokemonChainRouter = require('./routes/pokemon-chain.router');
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/', pokemonRouter);
app.use('/', pokemonSpeciesRouter);
app.use('/', pokemonChainRouter);
app.use('/', userRouter);
app.use('/', authRouter);

app.listen(process.env.PORT, async () => {
    try {        
        await dbConnection();

        console.log(`Server is running on port ${process.env.PORT}`)
    } catch(err) {
        console.log(err);
    }
});