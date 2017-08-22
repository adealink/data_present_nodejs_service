module.exports = appInfo => {
  const config = {};

  // add your config here
  // ========== mysql配置 ==============
  config.mysql = {};
  // ========== knex设置 ==============
  config.knex = {
    debug: true
  };

  return config;
};