const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const resolvers = require('./graphql/resolvers');
const Provider = require('./models/provider');

const app = express();
app.use(bodyParser.json());

// Sincronizar base de datos antes de levantar servidores
sequelize.sync().then(() => {
    console.log('✅ Database synced successfully!');

    // Iniciar Apollo Server (GraphQL)
    const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), 'utf-8');
    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen({ port: 4003 }).then(({ url }) => {
        console.log(`🚀 GraphQL server ready at ${url}`);
    });

    // Iniciar Express Server (REST)
    app.listen(5003, () => {
        console.log(`REST server listening on port 5003`);
    });
}).catch(err => {
    console.error('❌ Error syncing database:', err);
});
