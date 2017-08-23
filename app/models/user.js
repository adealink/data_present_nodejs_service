module.exports = app => {
  const user = {};

  user.getUser = () => {
    const Users = app.bookshelf.Model.extend({
      tableName: "users"
    });
    return Users;
  };

  /**
     * 获取指定手机号的用户
     * @param {*手机号} phone
     */
  user.getUserByPhone = async argPhone => {
    return await user.getUser().forge().where({ phone: argPhone }).fetch();
  };

  return user;
};