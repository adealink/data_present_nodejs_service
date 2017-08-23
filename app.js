const bookshelf = require("./lib/bookshelf");
const dataloader = require("./lib/dataloader");
const graphql = require("./lib/graphql");

module.exports = app => {
  // Knex.js + DataLoader + GraphQL
  // app.addSingleton("knex", () => Knex(app.config.knex));
  // app.addSingleton("bookshelf", () => bookshelf(app.knex));
  // app.bookshelf = bookshelf(app.knex);

  bookshelf(app);
  dataloader(app);
  graphql(app);
};
