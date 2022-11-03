const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './routes/auth.router.js', 
    './routes/user.router.js',
    './routes/pokemon.router.js',
    './routes/pokemon-species.router.js',
    './routes/pokemon-chain.router.js'
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js');
})