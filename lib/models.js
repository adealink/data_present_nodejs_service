const bookshelf = require("bookshelf");
const qs = require("qs");
const path = require("path");

// 将 app/models/**/*.js 包装并实例化，为 batchLoadFn 注入 egg 上下文
function wrapClass(loaderObj, app) {
  return class extends app.BaseContextClass {
    constructor(ctx) {
      super(ctx); // { ctx, app, config, service, ... } = this
      const loader = {};
      Object.entries(loaderObj).forEach(([loaderName, batchLoadFn]) => {
        const value =
          batchLoadFn instanceof bookshelf
            ? batchLoadFn
            : bookshelf(app.knex);
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
  // app.bookshelf
//   app.bookshelf = bookshelf(app.knex)
  app.addSingleton("bookshelf", () => bookshelf);
  // ctx.models.xxx.xxx
  app.loader.loadToContext(
    path.join(app.baseDir, "app/models"),
    "models",
    {
      caseStyle: "lower",
      initializer: exports =>
        wrapClass(typeof exports === "function" ? exports(app) : exports, app)
    }
  );
};
