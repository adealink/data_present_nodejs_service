'use strict';

module.exports = app => {

  //auth权限
  app.post('/auth/login', app.controller.auth.login);
  app.post('/auth/register', app.controller.auth.register);
  
  app.get('/', 'home.index');
};
