module.exports = app => ({
  phoneLoader(phones) {
    return app
      .knex("users")
      .whereIn("phone", phones)
      .then(this.map(phones, (phone, row) => phone === row.phone));
  }
});