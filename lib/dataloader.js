const FBDataLoader = require("dataloader");
const qs = require("qs");
const path = require("path");

/**
 * 框架会在每次用户请求发生时，在 ctx 对象上按需实例化代码中定义好的 DataLoader，在 service、controller 中只要直接通过 ctx.dataloader.user.xxxLoader 使用即可。
 * DataLoader 在每个请求到达时会重新实例化，这是因为 DataLoader 内部实现了对每个 SQL promise 的缓存，这个缓存仅用于避免一次请求中重复的 SQL 查询，并不能当成跨请求、跨进程、跨服务器的缓存使用
 * 
 * 自定义 DataLoader 以便为 batchLoadFn 注入上下文
 *
 * // app/dataloader/user.js
 * module.exports = app => ({
 *   phoneLoader(phones) {
 *     return app.knex('users').whereIn('phone', phones)
 *       .then(this.map(phones, (phone, row) => phone === row.phone));
 *   },
 *   paramLoader(params) {
 *     return params
 *       .reduce((query, param) => query.orWhere(param), app.knex('users'))
 *       .then(this.map(params, (param, row) => param.phone === row.phone && param.role === row.role));
 *   },
 * });
 *
 * // app/service/user.js
 * ...
 *   const { phoneLoader } = this.ctx.dataloader.user;
 *   const promises = phones.map(phone => phoneLoader.load(phone));
 *   const result = await Promise.all(promises);
 *   // => SELECT * FROM `users` WHERE `phone` IN (phone1, phone2, ...)
 * ...
 */
class DataLoader extends FBDataLoader {
  constructor(batchLoadFn, context) {
    // eslint-disable-next-line no-param-reassign
    if (context) batchLoadFn = batchLoadFn.bind(context);
    super(batchLoadFn, {
      cacheKeyFn: key => qs.stringify(key)
    });
  }
  options(opts) {
    // eslint-disable-next-line no-underscore-dangle
    this._options = { ...this._options, ...opts };
    return this;
  }
}

// 将 app/dataloader/**/*.js 包装并实例化，为 batchLoadFn 注入 egg 上下文
function wrapClass(loaderObj, app) {
  return class extends app.BaseContextClass {
    constructor(ctx) {
      super(ctx); // { ctx, app, config, service, ... } = this
      const loader = {};
      Object.entries(loaderObj).forEach(([loaderName, batchLoadFn]) => {
        const value =
          batchLoadFn instanceof DataLoader
            ? batchLoadFn
            : new DataLoader(batchLoadFn, this);
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
  // app.DataLoader
  app.addSingleton("DataLoader", () => DataLoader);
  // ctx.dataloader.xxx.xxxloader
  app.loader.loadToContext(
    path.join(app.baseDir, "app/dataloader"),
    "dataloader",
    {
      caseStyle: "lower",
      initializer: exports =>
        wrapClass(typeof exports === "function" ? exports(app) : exports, app)
    }
  );
};
