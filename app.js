const knex = require('knex');
const dataloader = require('./lib/dataloader');
const graphql = require('./lib/graphql');

module.exports = app => {
    // Knex.js + DataLoader + GraphQL
    app.addSingleton('knex', config => knex(app.config.knex));
    dataloader(app);
    graphql(app);
  };