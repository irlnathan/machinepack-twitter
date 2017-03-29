/**
 * constants/consumerKey.required
 */
module.exports = Object.assign(
  {},
  require('./consumerKey.optional'),
  { required: true }
);
