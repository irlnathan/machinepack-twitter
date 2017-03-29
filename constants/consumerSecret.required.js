/**
 * constants/consumerSecret.required
 */
module.exports = Object.assign(
  {},
  require('./consumerSecret.optional'),
  { required: true }
);
