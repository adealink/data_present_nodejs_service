const knex = require('knex');

module.exports = app => {
    // Knex.js + DataLoader + GraphQL
    app.addSingleton('knex', config => knex(app.config.knex));
    dataloader(app);
    graphql(app);
    
    // 输出 X-Response-Time 头，需确保位于第一个
    app.config.coreMiddleware.unshift('responseTime', 'urlFormatter');
  };