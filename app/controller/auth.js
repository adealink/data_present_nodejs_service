"use strict";

module.exports = app => {
  class AuthController extends app.Controller {
    /**
     * @api {post} /auth/register 注册账号
     * @apiVersion 1.0.0
     * @apiName register
     * @apiGroup auth
     * @apiPermission none
     *
     * @apiDescription 注册账号 作者: 孙晓冬
     *
     * @apiParam {String} phone 手机号
     * @apiParam {String} verifyCode 验证码
     * @apiParam {String} username 用户名
     * @apiParam {String} password 密码
     *
     * @apiSuccess {Integer}   code             状态码
     * @apiSuccess {String}    msg              状态信息
     * @apiSuccess {Object}    data             返回值
     *
     * @apiSuccessExample 成功返回
     * {  
        "code":1,
        "msg":"success",
        "data":null
    }
     *
     * @apiErrorExample 错误返回
     * {  
        "code":-1,
        "msg":"fail"
    }
     */
    async register() {
      const { ctx } = this;
      const param = {
        argPhone: ctx.request.body.phone,
        argUserName: ctx.request.body.username,
        argPassword: ctx.request.body.password,
        argVerifyCode: ctx.request.body.verifyCode,
      };
      const result = await ctx.service.user.register(param);
      ctx.success(result);
    }
    async login() {
      const { ctx } = this;
    }
  }

  return AuthController;
};
