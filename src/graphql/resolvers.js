const Provider = require('../models/provider');

const resolvers = {
    Query: {
        getAllProviders: async () => await Provider.findAll(),
        getProviderById: async (_, { id }) => await Provider.findByPk(id),
    },
};

module.exports = resolvers;
