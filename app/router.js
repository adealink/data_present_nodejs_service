'use strict';

module.exports = app => {

  //auth权限
  app.post('/auth/register', app.controller.auth.register);
  app.post('/auth/login', app.controller.auth.login);
  
};
