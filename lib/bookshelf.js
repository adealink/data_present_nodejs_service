const Knex = require("knex");
const qs = require("qs");
const path = require("path");
const Bookshelf = require("bookshelf");
const bookshelfMask = require("bookshelf-mask");
const bookshelfModelbase = require("bookshelf-modelbase").pluggable;

// 将 app/models/**/*.js 包装并实例化，为 bookshelf 注入 egg 上下文
function wrapClass(loaderObj, app) {
  return class extends app.BaseContextClass {
    constructor(ctx) {
      super(ctx); // { ctx, app, config, service, ... } = this
      const loader = {};
      Object.entries(loaderObj).forEach(([loaderName, bookshelf]) => {
        const value = bookshelf.bind(this);
        Object.defineProperty(loader, loaderName, { value });
      });
      return loader;
    }
    map(params, finder, rows) {
      if (!rows) return this.map.bind(null, params, finder);
      return params.map(param => rows.find(row => finder(param, row)));
    }
  };
}

module.exports = app => {
  const knex = Knex(app.config.knex);
  const bookshelf = Bookshelf(knex);

  bookshelf.plugin("registry");
  bookshelf.plugin("virtuals");
  bookshelf.plugin("visibility");
  bookshelf.plugin("pagination");
  bookshelf.plugin(bookshelfMask);
  bookshelf.plugin(bookshelfModelbase);

  app.addSingleton("knex", () => knex);
  app.bookshelf = bookshelf;

  const directory = path.join(app.baseDir, "app/models");
  app.loader.loadToApp(directory, "models", {
    caseStyle: "lower"
  });
  app.loader.loadToContext(path.join(app.baseDir, "app/models"), "models", {
    caseStyle: "lower",
    initializer: exports =>
      wrapClass(typeof exports === "function" ? exports(app) : exports, app)
  });
};